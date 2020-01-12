<div align="center">
  <img src="docs/logo.png" width="240" alt="Aqua Logo" />
  <h1>Aqua</h1>
  <h4>Totally <strike>useless</strike> useful CLI tool for social media platforms</h4>
</div>

## ❓ Description
TODO

## 🎓 Installation

### 🌐 From public package repositories

#### Yarn
```sh
$yarn global add aqua
```

#### npm
```sh
$npm install aqua --global
```

### 🆒 From this repository
```sh
$git clone https://github.com/merefu/aqua.git
$cd aqua
$yarn link
```

## 🛠 Modules

### facebook

A module for interacting with Facebook's Graph API via the command line.

### efio

For making your own "Every X Frame In Order" page.

Examples:
- [Every KonoSuba Frame In Order](https://www.facebook.com/Every-KonoSuba-Frame-In-Order-103785454477328)
- [Every Gabriel Dropout Frame In Order](https://www.facebook.com/EveryGabrielDropOutFrameInOrder)
- [Every Machikado Mazoku Frame In Order](https://www.facebook.com/MachikadoFrames/)

## 👀 Examples

### 📬 Posts

#### Publish a text post
```sh
$aqua facebook post create --accessToken ACCESS_TOKEN --object PAGE_ID --edge feed --message 'Hello Facebook!'
```

#### Publish a scheduled text post
```sh
$aqua facebook post create --accessToken ACCESS_TOKEN --object PAGE_ID --edge feed --scheduledPublishTime '2020/01/12 13:05:00' --message 'Hello Facebook!'
```

### 📷 Photos 

#### Publish an image post
```sh
$aqua facebook photos create --accessToken ACCESS_TOKEN --object YOUR_PAGE_ID_HERE --edge photos --message 'Hello Facebook!' --source /home/aqua/image.png
```

### ✉️ Comments

#### Post a text comment
```sh
$aqua facebook photos create --accessToken ACCESS_TOKEN --object POST_ID --message 'Hello Facebook!'
```

#### Post an image comment
```sh
$aqua facebook photos create --accessToken ACCESS_TOKEN --object POST_ID --message 'Hello Facebook!' --source /home/aqua/image.png
```

## ⛑ Contributing
Just make a PR <img src="docs/4Head.png" height="32" />