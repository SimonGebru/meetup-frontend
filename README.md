# MEETUPZ

# Länkar:
Inspelning: https://drive.google.com/file/d/1xzT6RWxE84zUze7FMsnhtvG5dKBFVpsc/view?usp=drive_link

Meetups: http://meetup-frontend-12345.s3-website.eu-north-1.amazonaws.com/

Backend-repo: https://github.com/SimonGebru/meetup-backend.git


# Arbetssätt & samarbete

Vi började med att läsa igenom uppgiften tillsammans för att säkerställa att alla hade förstått kraven och målet med projektet.

Därefter delade vi upp oss i två team:
	•	Frontend-teamet (React + AWS S3)
	•	Backend-teamet (Express + Docker + Render)

Vi bestämde tidigt att arbeta enligt ett Git Flow-upplägg, med följande branch-struktur:
	•	main -> produktionskod
	•	dev -> utvecklingsbranch
	•	feature/* -> individuella features

All kod som skulle in till main reviewades via Pull Requests, och merge till main triggade automatiskt en ny deployment till produktion via GitHub Actions.

⸻

# CI/CD-pipeline

Vi skapade två YAML-filer för GitHub Actions – en för frontend och en för backend.
Dessa pipelines byggdes tillsammans i grupp för att alla skulle förstå varje steg i flödet.

Frontend (React + AWS S3)
	•	Bygger React-appen med npm run build.
	•	Vid push till dev → laddar upp filerna till /dev-mappen i S3-bucketen.
	•	Vid push till main → laddar upp till root-nivån (/) i samma bucket (produktion).

Fördelar:
	•	Enkelt staging-flöde: https://bucket-url/dev/ används som testmiljö.
	•	Trygghet: dev påverkar aldrig produktionen.
	•	Snabb feedback: teamet kunde se resultatet live efter varje push.

⸻

Backend (Express + Docker + Render)
	•	Vid push till dev byggs en Docker image och pushas till Docker Hub som:
meetup-api:dev
	•	Vid push till main byggs istället meetup-api:prod-latest
	•	Render drar automatiskt rätt image beroende på branch:
	•	meetup-api-dev → följer dev
	•	meetup-api → följer latest

💡 Fördelar:
	•	Isolerade miljöer: dev och prod kan ha egna databaser och variabler.
	•	Reproducerbarhet: varje build får unik tagg, lätt att rulla tillbaka.
	•	Automatisk promotion: när dev är stabil -> merge till main -> prod uppdateras.

 # Arbetsflöde & kommunikation

Vi hade daglig kontakt via gruppchatt och möten varannan dag för att:
	•	Följa upp status och eventuella problem.
	•	Brainstorma lösningar.
	•	Säkerställa att frontend och backend höll ihop.

Det här gjorde att alla hade koll på projektets helhet, och att både kod och pipeline utvecklades i takt.


# Vår Reflektion

Projektet har gett oss en tydlig bild av hur CI/CD fungerar i praktiken.
Vi fick se hur automatisering, versionshantering och molndeployment hänger ihop och hur viktigt det är att ha en strukturerad branch-strategi och gemensam pipeline.


<img width="1444" height="827" alt="Skärmavbild 2025-11-07 kl  13 36 42" src="https://github.com/user-attachments/assets/1463e543-f560-47e9-9e42-c772f2faad04" />
<img width="1450" height="765" alt="Skärmavbild 2025-11-07 kl  13 37 01" src="https://github.com/user-attachments/assets/6c211af5-f12d-4c09-af14-81a468b43a19" />
