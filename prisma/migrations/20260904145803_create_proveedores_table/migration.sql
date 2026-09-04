-- CreateTable
CREATE TABLE "proveedores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "telefeno" TEXT,
    "direccion" TEXT,
    "activo" INTEGER NOT NULL DEFAULT 1,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
