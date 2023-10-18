-- CreateTable
CREATE TABLE `categorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoria` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `descripcion` VARCHAR(200) NOT NULL,
    `precio` DECIMAL(10, 2) NULL,
    `img` VARCHAR(50) NOT NULL DEFAULT 'coffee.jpg',
    `id_categoria` INTEGER NOT NULL,

    INDEX `categoria`(`id_categoria`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipos_de_variantes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `variante` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `variantes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_menu` INTEGER NOT NULL,
    `id_tipos_de_variantes` INTEGER NOT NULL,
    `precio` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,

    INDEX `menu`(`id_menu`),
    INDEX `tipos_de_variantes`(`id_tipos_de_variantes`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `extras` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `extra` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ingredientes_opcionales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ingrediente` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `platos_con_extras` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_menu` INTEGER NOT NULL,
    `id_extra` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,

    INDEX `FK_platos_con_extras_extras`(`id_extra`),
    INDEX `FK_platos_con_extras_menu`(`id_menu`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `platos_con_ingredientes_opcionales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_menu` INTEGER NOT NULL,
    `id_ingredientes_opcionales` INTEGER NOT NULL,

    INDEX `FK_platos_con_ingredientes_opcionales_ingredientes_opcionales`(`id_ingredientes_opcionales`),
    INDEX `FK_platos_con_ingredientes_opcionales_menu`(`id_menu`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(150) NOT NULL,
    `id_rol` INTEGER NOT NULL DEFAULT 1,

    INDEX `FK_clientes_roles`(`id_rol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roles` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordenes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_orden` INTEGER NOT NULL,
    `id_platos` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `precio_total` DECIMAL(10, 2) NOT NULL,
    `id_cliente` INTEGER NOT NULL,
    `fecha_creacion` DATETIME(0) NOT NULL,

    INDEX `FK_ordenes_clientes`(`id_cliente`),
    INDEX `FK_ordenes_menu`(`id_platos`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordenes_extras` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_menu` INTEGER NOT NULL DEFAULT 0,
    `id_ingrediente` INTEGER NOT NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `id_ordenes` INTEGER NOT NULL,

    INDEX `FK_ordenes_extras_ordenes`(`id_ordenes`),
    INDEX `FK_ordenes_extras_extras`(`id_ingrediente`),
    INDEX `FK_ordenes_extras_menu`(`id_menu`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordenes_ingredientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_menu` INTEGER NOT NULL,
    `id_titulo` INTEGER NULL,
    `id_opciones` INTEGER NULL DEFAULT 0,
    `id_ingrediente` INTEGER NULL DEFAULT 0,
    `id_variante` INTEGER NULL,
    `id_ordenes` INTEGER NOT NULL,

    INDEX `FK_ordenes_ingredientes_ordenes`(`id_ordenes`),
    INDEX `FK_ordenes_ingredientes_ordenes_ingredientes_ingrediente`(`id_opciones`),
    INDEX `FK_ordenes_ingredientes_ordenes_ingredientes_titulos`(`id_titulo`),
    INDEX `FK_ordenes_ingredientes_tipos_de_variantes`(`id_variante`),
    INDEX `FK_ordenes_ingredientes_ingredientes_opcionales`(`id_ingrediente`),
    INDEX `FK_ordenes_ingredientes_menu`(`id_menu`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordenes_ingredientes_ingrediente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ingrediente` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordenes_ingredientes_titulos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `menu` ADD CONSTRAINT `categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categorias`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `variantes` ADD CONSTRAINT `menu` FOREIGN KEY (`id_menu`) REFERENCES `menu`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `variantes` ADD CONSTRAINT `tipos_de_variantes` FOREIGN KEY (`id_tipos_de_variantes`) REFERENCES `tipos_de_variantes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `platos_con_extras` ADD CONSTRAINT `FK_platos_con_extras_extras` FOREIGN KEY (`id_extra`) REFERENCES `extras`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `platos_con_extras` ADD CONSTRAINT `FK_platos_con_extras_menu` FOREIGN KEY (`id_menu`) REFERENCES `menu`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `platos_con_ingredientes_opcionales` ADD CONSTRAINT `FK_platos_con_ingredientes_opcionales_ingredientes_opcionales` FOREIGN KEY (`id_ingredientes_opcionales`) REFERENCES `ingredientes_opcionales`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `platos_con_ingredientes_opcionales` ADD CONSTRAINT `FK_platos_con_ingredientes_opcionales_menu` FOREIGN KEY (`id_menu`) REFERENCES `menu`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `clientes` ADD CONSTRAINT `FK_clientes_roles` FOREIGN KEY (`id_rol`) REFERENCES `roles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ordenes` ADD CONSTRAINT `FK_ordenes_clientes` FOREIGN KEY (`id_cliente`) REFERENCES `clientes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ordenes` ADD CONSTRAINT `FK_ordenes_menu` FOREIGN KEY (`id_platos`) REFERENCES `menu`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ordenes_extras` ADD CONSTRAINT `FK_ordenes_extras_extras` FOREIGN KEY (`id_ingrediente`) REFERENCES `extras`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ordenes_extras` ADD CONSTRAINT `FK_ordenes_extras_menu` FOREIGN KEY (`id_menu`) REFERENCES `menu`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ordenes_extras` ADD CONSTRAINT `FK_ordenes_extras_ordenes` FOREIGN KEY (`id_ordenes`) REFERENCES `ordenes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ordenes_ingredientes` ADD CONSTRAINT `FK_ordenes_ingredientes_ingredientes_opcionales` FOREIGN KEY (`id_ingrediente`) REFERENCES `ingredientes_opcionales`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ordenes_ingredientes` ADD CONSTRAINT `FK_ordenes_ingredientes_menu` FOREIGN KEY (`id_menu`) REFERENCES `menu`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ordenes_ingredientes` ADD CONSTRAINT `FK_ordenes_ingredientes_ordenes` FOREIGN KEY (`id_ordenes`) REFERENCES `ordenes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ordenes_ingredientes` ADD CONSTRAINT `FK_ordenes_ingredientes_ordenes_ingredientes_ingrediente` FOREIGN KEY (`id_opciones`) REFERENCES `ordenes_ingredientes_ingrediente`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ordenes_ingredientes` ADD CONSTRAINT `FK_ordenes_ingredientes_ordenes_ingredientes_titulos` FOREIGN KEY (`id_titulo`) REFERENCES `ordenes_ingredientes_titulos`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ordenes_ingredientes` ADD CONSTRAINT `FK_ordenes_ingredientes_tipos_de_variantes` FOREIGN KEY (`id_variante`) REFERENCES `tipos_de_variantes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
