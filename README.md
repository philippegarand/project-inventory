# KDOMAX
[See the final product in action!](https://drive.google.com/file/d/1zQZUH62I_fwxbGFDqt6nR6mrUs_BsRFO/view?usp=sharing)
### Table of Contents

1.  [Setup](#setup)
    - [Https](#https)
2.  [Startup](#startup-the-project)
    - [Development](#development)
    - [Production](#production)
3.  [Migrations](<#migrations-dev>)

## Setup

In the web-app folder, create the file `config.js` based on `config_template.js`.

Also create the file `.env.local` based on `.env.local.template`.

### Development only

Double click on the `localhost.crt` certificate in `Inventaire/web-app/certificates` and install it on your machine.

### Https

To make th app work properly, you may need to accept the risk warning of your browser (caused by self-signed certificate), and also do the same for the api (to do so, try to navigate to an endpoint such as `https://{local-ip}:1337/api/category`)

## Startup the project

### Development

In the project folder /Inventory, run the following command :

```
docker-compose up --build
```

In the project folder /Inventory/web-app, run the following command :

```
npm run dev
```

Access the API / swagger from :

```
https://{local-ip}:1337/swagger/index.html
```

Access the web app from :

```
https://{local-ip}:3000
```

### Production

In a CMD, run these commands and say 'yes' when prompted

```
dotnet dev-certs https --clean
dotnet dev-certs https --trust -ep %USERPROFILE%\.aspnet\https\API.pfx -p Password01!
```

In the project folder /Inventory, run the following command :

```
docker-compose -f docker-compose.prod.yml up --build
```

Access the web app from :

```
https://{local-ip}:3000
```

## Migrations (dev)

In NuGet Package Manager Console

Add mirgation with :

```
Add-Migration migration-name
```

Then run :

```
Update-Database
```
