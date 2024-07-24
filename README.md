### Install NVM on Ubuntu 20.04
# 1. Installing NVM on Ubuntu
```bash
$ sudo apt install curl
$ curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 
$ source ~/.bashrc
```

# 2. Installing Node using NVM
```bash
$ nvm install node
$ nvm install 20.9.0
$ nvm install --lts
```

# 3. Working with NVM
```bash
$ nvm ls
$ nvm ls-remote 
$ nvm use 20.9.0
$ nvm run default --version
```

# 4. Uninstall Node Version
```bash
$ nvm uninstall 20.9.0
```

### Installation next-app
> Automatic Installation
```bash
$ npx create-next-app@latest
$ npm install --global yarn
$ yarn create next-app
```
> Starting the server
```bash
$ yarn run dev
```
### Then install the Supabase client library: supabase-js
```bash
$ npm install @supabase/supabase-js
```
### Integrating openai API with nextjs
```bash
npm install openai
```