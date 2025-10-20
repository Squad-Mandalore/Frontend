# 🏃‍♂️ Squad-Mandalore Sportvereins-Management System - Frontend

Eine moderne Web-Applikation zur Verwaltung von Jugendvereinen und Sportvereinen. Das System ermöglicht die umfassende Verwaltung von Athleten, Trainern, Übungen, Leistungen und Sportabzeichen.

## 📋 Über das Projekt

Das Squad-Mandalore Frontend ist eine Angular-basierte Single-Page-Application (SPA), die in Verbindung mit dem [Backend](https://github.com/Squad-Mandalore/Backend) ein vollständiges Vereinsmanagement-System bildet. Die Anwendung wurde speziell für Jugendvereine entwickelt und bietet eine intuitive Benutzeroberfläche für die tägliche Vereinsarbeit.

### 🎯 Hauptfunktionen

- **👥 Athletenverwaltung**: Registrierung, Profilverwaltung und Leistungsübersicht von Sportlern
- **🏃‍♂️ Trainerverwaltung**: Verwaltung von Trainerprofilen und Zuordnung zu Athletengruppen
- **🏅 Medaillen & Auszeichnungen**: Tracking von Sportabzeichen, Medaillen und Leistungen
- **📊 Übungskatalog**: Umfassende Datenbank mit Sportübungen und Disziplinen
- **📈 Leistungsanalyse**: Visualisierung von Trainingsfortschritten und Wettkampfergebnissen
- **🔐 Benutzerverwaltung**: Rollenbasierte Zugriffskontrolle (Admin, Trainer, Athlet)
- **📱 Responsive Design**: Optimiert für Desktop, Tablet und Mobile

### 🛠️ Technologie-Stack

- **Frontend Framework**: Angular 17+
- **UI/UX**: Custom SCSS Design System
- **State Management**: RxJS & Angular Services
- **Testing**: Karma + Jasmine
- **Build Tool**: Angular CLI
- **Code Quality**: ESLint + Prettier
- **Package Manager**: Bun (schneller als npm)

## 🚀 Schnellstart

### Voraussetzungen

- [Node.js](https://nodejs.org/) (Version 18 oder höher)
- [Bun](https://bun.sh/) (Package Manager - schneller als npm)
- [Git](https://git-scm.com/)
- Chrome/Chromium Browser (für Tests)

### Installation

1. **Repository klonen**
   ```bash
   git clone https://github.com/Squad-Mandalore/Frontend.git
   cd Frontend
   ```

2. **Abhängigkeiten installieren**
   ```bash
   bun install
   ```

3. **Backend einrichten**
   
   Das Frontend benötigt das Backend für die vollständige Funktionalität:
   ```bash
   # In einem separaten Terminal/Ordner
   git clone https://github.com/Squad-Mandalore/Backend.git
   cd Backend
   # Folgen Sie den Setup-Anweisungen im Backend README
   ```

4. **OpenAPI Generierung**
   
   Für die Kommunikation mit dem Backend:
   ```bash
   # Mit laufendem Backend auf localhost
   bun run apigen
   
   # Oder mit älterer API-Version (fallback)
   bun run apigen-f
   ```

5. **Development Server starten**
   ```bash
   bun run dev
   # oder
   ng serve
   ```
   
   Die Anwendung ist nun unter `http://localhost:4200` erreichbar.

## 🔧 Entwicklung

### Development Server

```bash
bun run start
# oder
ng serve
```
Startet den Entwicklungsserver. Die Anwendung lädt automatisch neu bei Dateiänderungen.

### Code Generierung

```bash
ng generate component component-name
ng generate service service-name
ng generate guard guard-name
```

### Tests ausführen

```bash
bun run test
```

### Build

```bash
# Production Build
bun run build
# oder Development Build
ng build
```

## 📁 Projektstruktur

```
src/
├── app/
│   ├── components/          # Wiederverwendbare UI-Komponenten
│   │   ├── athlete-card/    # Athleten-Karten
│   │   ├── navbar-bottom/   # Navigation
│   │   ├── sidebar/         # Seitenleiste
│   │   └── ...
│   ├── pages/              # Hauptseiten der Anwendung
│   │   ├── dashboard-page/ # Dashboard/Übersicht
│   │   ├── login-page/     # Anmeldung
│   │   └── ...
│   ├── shared/             # Geteilte Services und Utilities
│   │   ├── generated/      # Auto-generierte API-Clients
│   │   ├── guard/          # Route Guards
│   │   └── services/       # Business Logic Services
│   └── utils/              # Hilfsfunktionen
├── assets/                 # Statische Assets (Bilder, Fonts)
└── styles.scss            # Globale Styles
```

## 🌐 API Integration

Das Frontend kommuniziert über eine RESTful API mit dem Backend. Die API-Clients werden automatisch aus der OpenAPI-Spezifikation generiert:

- **Backend Repository**: [Squad-Mandalore/Backend](https://github.com/Squad-Mandalore/Backend)
- **API Dokumentation**: Verfügbar im Backend unter `/docs` (Swagger UI)

### API Endpoints (Beispiele)

- `GET /athletes` - Athleten abrufen
- `POST /athletes` - Neuen Athleten erstellen
- `GET /exercises` - Übungskatalog abrufen
- `POST /auth/login` - Benutzeranmeldung

## 📦 Deployment

### Docker (Compose)

```bash
# Docker Image bauen
docker build -t squad-mandalore-frontend .

# Container starten
docker run -p 4200:80 squad-mandalore-frontend
```

## 📞 Support & Kontakt

- **Issues**: [GitHub Issues](https://github.com/Squad-Mandalore/Frontend/issues)
- **Backend**: [Squad-Mandalore/Backend](https://github.com/Squad-Mandalore/Backend)
- **Wiki**: [Projektdokumentation](https://github.com/Squad-Mandalore/Frontend/wiki)

## 📄 Lizenz

Dieses Projekt unterliegt einer proprietären Lizenz. Weitere Informationen finden Sie in der [LICENSE](LICENSE) Datei.

## 🔄 Changelog

### Version 1.0.0
- xxx
- AI-generated READMe.md (pretty good tho)

---

**Entwickelt mit ❤️ von Squad-Mandalore für die Jugendvereinsarbeit**
