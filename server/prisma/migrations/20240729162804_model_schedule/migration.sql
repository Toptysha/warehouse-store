-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleUser" (
    "scheduleId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ScheduleUser_pkey" PRIMARY KEY ("scheduleId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_date_key" ON "Schedule"("date");

-- AddForeignKey
ALTER TABLE "ScheduleUser" ADD CONSTRAINT "ScheduleUser_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleUser" ADD CONSTRAINT "ScheduleUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
