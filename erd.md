---

# 📊 Entity-Relationship Diagram (ERD) – ScanApp MVP

Diagram ini memvisualisasikan bagaimana data **User**, **Document**, **Scanned Page**, dan **File Storage** saling terhubung di dalam backend **Appwrite**.

```mermaid
erDiagram
    USER {
        string userId PK "Appwrite User ID"
        string email "User's email (optional)"
        string name "User's name (optional)"
    }

    DOCUMENT {
        string documentId PK "Unique Document ID"
        string title "Document Title"
        datetime createdAt "Creation Timestamp"
        string ownerId FK "Links to USER.userId"
    }

    SCANNED_PAGE {
        string pageId PK "Unique Page ID"
        int pageNumber "Page order (e.g., 1)"
        string documentId FK "Links to DOCUMENT.documentId"
        string processedImageId FK "Links to FILE_STORAGE.fileId"
    }

    FILE_STORAGE {
        string fileId PK "Appwrite Storage File ID"
        string fileName "Original file name"
        int size "File size in bytes"
        string mimeType "MIME type (e.g., 'image/jpeg')"
    }

    USER ||--o{ DOCUMENT : owns
    DOCUMENT ||--o{ SCANNED_PAGE : contains
    SCANNED_PAGE ||--|| FILE_STORAGE : references
```

---

## 📌 Penjelasan Detail ERD

### 1. Entitas (Kotak Persegi)

- **USER**

  - Representasi pengguna aplikasi.
  - Walaupun login anonim, Appwrite tetap membuat `userId` unik.
  - **userId (PK)**: Primary Key unik.
  - **email & name (opsional)**: bisa kosong pada login anonim.

- **DOCUMENT**

  - Representasi dokumen hasil pindaian (contoh: _Kwitansi Oktober_, _Tugas Kalkulus_).
  - **documentId (PK)**: unik untuk setiap dokumen.
  - **title**: judul dokumen.
  - **createdAt**: timestamp pembuatan.
  - **ownerId (FK)**: relasi ke `USER.userId`.

- **SCANNED_PAGE**

  - Representasi halaman dalam dokumen.
  - **pageId (PK)**: unik untuk setiap halaman.
  - **pageNumber**: urutan halaman (1, 2, 3, …).
  - **documentId (FK)**: relasi ke `DOCUMENT.documentId`.
  - **processedImageId (FK)**: relasi ke `FILE_STORAGE.fileId`.

- **FILE_STORAGE**

  - Representasi file hasil scan di Appwrite Storage.
  - **fileId (PK)**: ID file unik di Appwrite.
  - **fileName**: nama file asli.
  - **size**: ukuran file (bytes).
  - **mimeType**: tipe file (contoh: `image/jpeg`).

---

### 2. Relasi (Garis Penghubung)

- **USER → DOCUMENT**

  - Satu **User** dapat memiliki banyak **Document**.
  - Kardinalitas: `1-to-many`.

- **DOCUMENT → SCANNED_PAGE**

  - Satu **Document** dapat memiliki banyak **Scanned Page**.
  - Kardinalitas: `1-to-many`.
  - ⚠️ Di MVP hanya 1 halaman/dokumen, tapi skema sudah siap multi-halaman.

- **SCANNED_PAGE → FILE_STORAGE**

  - Satu **Scanned Page** harus merujuk ke **satu file di Storage**.
  - Kardinalitas: `1-to-1`.

---
