# Documentation des Routes de Prestations

## Base URL
```
/api/prestation
```

## Schémas

### Schéma d'Image
```typescript
{
    filename: string,
    principale?: boolean, // défaut: false
    data?: string // données base64
}
```

### Schéma de Prestation
```typescript
{
    prestationId: number,
    prestationNom: string, // requis
    prestationDescription?: string,
    prestationImages?: ImageSchema[],
    status?: number, // 0: INACTIVE, 1: ACTIVE
    prestationDateCreation?: Date
}
```

## Endpoints

### 1. Créer une Prestation
- **Méthode**: POST
- **URL**: `/create`
- **Description**: Crée une nouvelle prestation
- **Contrôleur**: `createPrestation`
- **Payload**:
```json
{
  "prestationNom": "string",
  "prestationDescription": "string",
  "prestationImages": [
    {
      "filename": "string",
      "principale": false,
      "data": "string"
    }
  ]
}
```
- **Réponse Succès** (200):
```json
{
  "success": true,
  "data": {
    "prestationId": "number",
    "prestationNom": "string",
    "prestationDescription": "string",
    "prestationImages": [
      {
        "filename": "string",
        "principale": false
      }
    ],
    "status": 1,
    "prestationDateCreation": "date"
  }
}
```
- **Réponse Erreur** (400/500):
```json
{
  "status": "error",
  "type": "VALIDATION_ERROR | DATABASE_ERROR | FILE_ERROR | UNKNOWN_ERROR",
  "message": "Message d'erreur détaillé",
  "details": {
    "path": "chemin.du.champ",
    "message": "Message d'erreur spécifique"
  }
}
```

### 2. Obtenir une Prestation par ID
- **Méthode**: GET
- **URL**: `/fetchById/:prestationId`
- **Description**: Récupère les détails d'une prestation spécifique
- **Paramètres**:
  - `prestationId`: ID de la prestation (paramètre d'URL)
- **Contrôleur**: `getPrestationById`
- **Réponse Succès** (200):
```json
{
  "success": true,
  "data": {
    "prestationId": "number",
    "prestationNom": "string",
    "prestationDescription": "string",
    "prestationImages": [
      {
        "filename": "string",
        "principale": false
      }
    ],
    "status": 1,
    "prestationDateCreation": "date"
  }
}
```
- **Réponse Erreur** (404/500):
```json
{
  "status": "error",
  "type": "NOT_FOUND | DATABASE_ERROR | UNKNOWN_ERROR",
  "message": "Message d'erreur détaillé",
  "details": "Détails supplémentaires en mode développement"
}
```

### 3. Lister Toutes les Prestations
- **Méthode**: GET
- **URL**: `/fetchAll`
- **Description**: Récupère la liste de toutes les prestations
- **Contrôleur**: `getAllPrestations`
- **Réponse Succès** (200):
```json
{
  "success": true,
  "data": [
    {
      "prestationId": "number",
      "prestationNom": "string",
      "prestationDescription": "string",
      "prestationImages": [
        {
          "filename": "string",
          "principale": false
        }
      ],
      "status": 1,
      "prestationDateCreation": "date"
    }
  ]
}
```
- **Réponse Erreur** (500):
```json
{
  "status": "error",
  "type": "DATABASE_ERROR | UNKNOWN_ERROR",
  "message": "Message d'erreur détaillé",
  "details": "Détails supplémentaires en mode développement"
}
```

### 4. Mettre à Jour une Prestation
- **Méthode**: PUT
- **URL**: `/update`
- **Description**: Met à jour les informations d'une prestation existante
- **Contrôleur**: `updatePrestation`
- **Payload**:
```json
{
  "prestationId": "number",
  "prestationNom": "string",
  "prestationDescription": "string",
  "prestationImages": [
    {
      "filename": "string",
      "principale": false,
      "data": "string"
    }
  ],
  "status": 1
}
```
- **Réponse Succès** (200):
```json
{
  "success": true,
  "data": {
    "prestationId": "number",
    "prestationNom": "string",
    "prestationDescription": "string",
    "prestationImages": [
      {
        "filename": "string",
        "principale": false
      }
    ],
    "status": 1,
    "prestationDateCreation": "date"
  }
}
```
- **Réponse Erreur** (400/404/500):
```json
{
  "status": "error",
  "type": "VALIDATION_ERROR | NOT_FOUND | DATABASE_ERROR | FILE_ERROR | UNKNOWN_ERROR",
  "message": "Message d'erreur détaillé",
  "details": "Détails supplémentaires en mode développement"
}
```

### 5. Supprimer une Prestation
- **Méthode**: DELETE
- **URL**: `/delete/:prestationId`
- **Description**: Supprime une prestation spécifique
- **Paramètres**:
  - `prestationId`: ID de la prestation à supprimer (paramètre d'URL)
- **Contrôleur**: `deletePrestation`
- **Réponse Succès** (200):
```json
{
  "success": true,
  "message": "Prestation supprimée avec succès"
}
```
- **Réponse Erreur** (404/500):
```json
{
  "status": "error",
  "type": "NOT_FOUND | DATABASE_ERROR | UNKNOWN_ERROR",
  "message": "Message d'erreur détaillé",
  "details": "Détails supplémentaires en mode développement"
}
```

### 6. Activer une Prestation
- **Méthode**: PUT
- **URL**: `/activate/:prestationId`
- **Description**: Active une prestation spécifique
- **Paramètres**:
  - `prestationId`: ID de la prestation à activer (paramètre d'URL)
- **Contrôleur**: `activatePrestation`
- **Réponse Succès** (200):
```json
{
  "success": true,
  "data": {
    "prestationId": "number",
    "status": 1
  }
}
```
- **Réponse Erreur** (404/500):
```json
{
  "status": "error",
  "type": "NOT_FOUND | DATABASE_ERROR | UNKNOWN_ERROR",
  "message": "Message d'erreur détaillé",
  "details": "Détails supplémentaires en mode développement"
}
```

## Notes
- Toutes les routes sont protégées par un rate limiter (100 requêtes par 15 minutes par IP)
- Les réponses sont au format JSON
- Les images des prestations sont accessibles via le chemin `/image`
- Codes d'erreur HTTP courants :
  - 200 : Succès
  - 400 : Requête invalide
  - 404 : Ressource non trouvée
  - 500 : Erreur serveur
- Statuts de prestation :
  - 0 : INACTIVE
  - 1 : ACTIVE 