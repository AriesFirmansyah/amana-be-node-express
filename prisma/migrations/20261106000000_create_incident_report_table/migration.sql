-- CreateTable
CREATE TABLE `incident_report` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reference_number` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `category` ENUM('FRAUD', 'HARASSMENT', 'SAFETY_VIOLATION', 'MISUSE_OF_RESOURCES', 'CORRUPTION', 'CONFLICT_OF_INTEREST', 'DATA_PRIVACY_BREACH', 'OTHER') NOT NULL,
    `description` TEXT NOT NULL,
    `incident_date` DATETIME(3) NOT NULL,
    `status` ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'RESOLVED') NOT NULL DEFAULT 'DRAFT',
    `admin_notes` TEXT NULL,
    `reporter_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `incident_report_reference_number_key`(`reference_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `incident_report` ADD CONSTRAINT `incident_report_reporter_id_fkey` FOREIGN KEY (`reporter_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
