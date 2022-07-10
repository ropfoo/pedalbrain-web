-- CreateTable
CREATE TABLE "Pedal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Knob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "posX" REAL NOT NULL,
    "posY" REAL NOT NULL,
    "rotation" REAL NOT NULL,
    "pedalId" TEXT,
    CONSTRAINT "Knob_pedalId_fkey" FOREIGN KEY ("pedalId") REFERENCES "Pedal" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
