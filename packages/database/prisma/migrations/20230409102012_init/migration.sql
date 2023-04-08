-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('earlyBird', 'college');

-- CreateEnum
CREATE TYPE "TicketErrorType" AS ENUM ('unknown', 'soldOut', 'thsrServerError', 'cookiesExpired', 'solvingCaptchaWrong', 'parsePageFailed', 'badRequest');

-- CreateEnum
CREATE TYPE "Station" AS ENUM ('NanGang', 'TaiPei', 'BanQiao', 'TaoYuan', 'XinZhu', 'MiaoLi', 'TaiZhong', 'ZhangHua', 'YunLin', 'JiaYi', 'TaiNan', 'ZuoYing');

-- CreateEnum
CREATE TYPE "BookingMethod" AS ENUM ('trainNo', 'time');

-- CreateEnum
CREATE TYPE "CarType" AS ENUM ('Standard', 'Business');

-- CreateEnum
CREATE TYPE "SeatType" AS ENUM ('NoRequired', 'WindowSeat', 'AisleSeat');

-- CreateEnum
CREATE TYPE "MemberType" AS ENUM ('NotMember', 'Member');

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "startStation" "Station" NOT NULL,
    "endStation" "Station" NOT NULL,
    "ticketDate" TIMESTAMP(3) NOT NULL,
    "bookDate" DATE NOT NULL,
    "bookingMethod" "BookingMethod" NOT NULL,
    "trainNo" INTEGER NOT NULL,
    "carType" "CarType" NOT NULL,
    "seatType" "SeatType" NOT NULL,
    "taiwanId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "adultTicket" SMALLINT NOT NULL,
    "childTicket" SMALLINT NOT NULL,
    "disabledTicket" SMALLINT NOT NULL,
    "elderTicket" SMALLINT NOT NULL,
    "collegeTicket" SMALLINT NOT NULL,
    "memberType" "MemberType" NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isSoldOut" BOOLEAN NOT NULL DEFAULT false,
    "isBadRequest" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketResult" (
    "id" SERIAL NOT NULL,
    "ticketId" TEXT NOT NULL,
    "trainNo" INTEGER NOT NULL,
    "departureTime" TEXT NOT NULL,
    "arrivalTime" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reservationId" INTEGER NOT NULL,

    CONSTRAINT "TicketResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketError" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "errorType" "TicketErrorType" NOT NULL DEFAULT 'unknown',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reservationId" INTEGER NOT NULL,

    CONSTRAINT "TicketError_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discount" (
    "type" "DiscountType" NOT NULL,
    "trainNo" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "minDiscountRatio" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SpecialBookDay" (
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "startBookDay" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "TicketResult_reservationId_key" ON "TicketResult"("reservationId");

-- CreateIndex
CREATE UNIQUE INDEX "Discount_type_trainNo_date_key" ON "Discount"("type", "trainNo", "date");

-- CreateIndex
CREATE UNIQUE INDEX "SpecialBookDay_startDate_key" ON "SpecialBookDay"("startDate");

-- CreateIndex
CREATE UNIQUE INDEX "SpecialBookDay_endDate_key" ON "SpecialBookDay"("endDate");

-- CreateIndex
CREATE UNIQUE INDEX "SpecialBookDay_startBookDay_key" ON "SpecialBookDay"("startBookDay");

-- AddForeignKey
ALTER TABLE "TicketResult" ADD CONSTRAINT "TicketResult_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketError" ADD CONSTRAINT "TicketError_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
