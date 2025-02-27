# Hotel Chat App

Bu proje, Typescript, Next.js, Shadcn ve MongoDB kullanılarak oluşturulmuş modern ve basit bir arayüze sahip yapay zeka destekli bir sohbet uygulamasıdır. Projenin amacı bir otele ait olabilecek örnek bir MongoDB veritabanında yer alan döküman kayıtlarını OpenAI modelleriyle entegreli bir şekilde kullanarak kullanıcıların sorularını cevaplayacak bir sistem geliştirmektir.

## Kurulum

1. Bu depoyu kendi localinize klonlayın.

```command
  git clone https://github.com/er4y-c/hotel-chat-app.git
```

2. Bağımlılıkları kurun.

```command
  yarn install
```

3. .env.example.local dosyasındaki bilgileri kullanarak kendi .env.production.local ve .env.development.local dosyalarınızı oluşturun.

4. Uygulamayı development modunda başlatın.

```command
  yarn dev
```

## Kullanılan Teknolojiler

- React.js 19
- Next.js 15
- Shadcn
- Typescript
- OpenAI
- MongoDB
- Langchain

## Sistem Mimarisi

![Sistem Mimarisi](/public/architecture.svg)

## Arayüz

![Örnek Arayüz](/public/ui.png)
