const moment = require('moment');
const FormData = require('form-data');
const request = require('axios');
const querystring = require('querystring');
const stream = require('stream');
const path = require('path');
const fs = require('fs');

class FB {
    constructor(params) {
        this.params = {
            version: 'v5.0',
            ...params,
        };
        this.baseUri = `https://graph.facebook.com/${this.params.version}`;
    }

    async api(path, method, params) {
        if(!path) throw new Error('Invalid path specified');
        if(!method) method = 'get';

        const isFormData = params instanceof FormData;
        const req = request({
            method,
            url: /^[a-zA-Z]+?:\/\//.test(path) ? path : `${this.baseUri}${path}`,
            data: isFormData ? params.getBuffer() : params,
            headers: isFormData ? params.getHeaders() : null,
        });

        return req;
    }
}

FB.Helper = class {
    constructor(fb, accessToken) {
        if(!fb) throw new Error('fb must be non-null');
        if(!accessToken) throw new Error('accessToken must be non-null');

        this.fb = fb;
        this.accessToken = accessToken;
    }

    static _isValidPublishTime(time) {        
        const duration = moment.duration(time.diff(moment()));
        return duration.asMinutes() >= 10 &&
               duration.asMonths() <= 6;
    }

    async deletePost(id) {
        let queryParams = {
            access_token: this.accessToken,
        };

        const req = this.fb.api(`/${id}?${querystring.stringify(queryParams)}`, 'delete');

        return await req;
    }

    async getPosts(object, edge, opts) {
        const queryParams = querystring.stringify({
            access_token: this.accessToken,
            ...(opts.until && { until: opts.until }),
            ...(opts.since && { since: opts.since }),
        });
        let nextUrl = `/${object}/${edge}?${queryParams}`;

        let entries = [];
        while(true) {
            const req = await this.fb.api(nextUrl);
            const data = req.data;
            const posts = data.data;

            entries = entries.concat(posts);

            nextUrl = data.paging.next;
            if(!Boolean(nextUrl)) break;
        }

        return entries;
    }

    async publishPost(object, edge, opts) {
        let params = {
            access_token: this.accessToken,
            ...(opts.message && { message: opts.message }),
            ...(opts.link && { link: opts.link }),
        };

        if(opts.scheduled_publish_time) {
            const scheduledPublishTime = moment.unix(opts.scheduled_publish_time);
            if(!(scheduledPublishTime && scheduledPublishTime.isValid())) throw new Error('Invalid scheduledPublishTime');
            if(!this.constructor._isValidPublishTime(scheduledPublishTime)) throw new Error('Specified scheduledPublishTime must be within 10 minutes or 6 months from now');

            params.published = false;
            params.scheduled_publish_time = scheduledPublishTime.unix();
        }

        const req = this.fb.api(`/${object}/${edge}`, 'post', params);

        return await req;
    }

    async publishPhoto(object, edge, opts) {
        if(!(opts.source || opts.url)) throw new Error('Must pass either source or url');
        if(opts.source && opts.url) throw new Error('source and url are exclusive');

        const params = new FormData();
        params.append('access_token', this.accessToken);
        if(opts.url) params.append('url', opts.url);
        if(opts.source) {
            if(typeof opts.source === 'string' || opts.source instanceof String) {
                params.append('source', fs.readFileSync(opts.source), path.basename(opts.source));
            } else if(opts.source instanceof Buffer) {
                params.append('source', opts.source);
            } else {
                params.append('source', opts.source);
            }
        }
        if(opts.message) params.append('message', opts.message);

        if(opts.scheduled_publish_time) {
            const scheduledPublishTime = moment.unix(opts.scheduled_publish_time);
            if(!(scheduledPublishTime && scheduledPublishTime.isValid())) throw new Error('Invalid scheduledPublishTime');
            if(!this.constructor._isValidPublishTime(scheduledPublishTime)) throw new Error('Specified scheduledPublishTime must be within 10 minutes or 6 months from now');

            params.append('published', 'false');
            params.append('scheduled_publish_time', scheduledPublishTime.unix());
        }

        const req = this.fb.api(`/${object}/${edge}`, 'post', params);

        return await req;
    }

    async publishComment(object, opts) {
        if(!(opts.message || opts.attachment_id || opts.attachment_share_url || opts.attachment_url || opts.source)) throw new Error('Must pass either source or attachment_url');

        const params = new FormData();
        params.append('access_token', this.accessToken);
        if(opts.attachment_id) params.append('attachment_id', opts.attachment_id);
        if(opts.attachment_share_url) params.append('attachment_share_url', opts.attachment_share_url);
        if(opts.attachment_url) params.append('attachment_url', opts.attachment_url);
        if(opts.source) {
            if(typeof opts.source === 'string' || opts.source instanceof String) {
                params.append('source', fs.readFileSync(opts.source), path.basename(opts.source));
            } else if(opts.source instanceof Buffer) {
                params.append('source', opts.source);
            } else {
                params.append('source', opts.source);
            }
        }
        if(opts.message) params.append('message', opts.message);

        const req = this.fb.api(`/${object}/comments`, 'post', params);

        return await req;
    }
};

module.exports = exports = FB;
