import "dotenv/config";
import * as bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Starting seed...");

    // Clear existing data
    await prisma.enrollment.deleteMany();
    await prisma.class.deleteMany();
    await prisma.discipline.deleteMany();
    await prisma.user.deleteMany();

    const studentPassword = await bcrypt.hash("Student123!", 10);
    const teacherPassword = await bcrypt.hash("Teacher123!", 10);

    // ─── Teachers ─────────────────────────────────────────────────────────────
    const teachers = await Promise.all([
        prisma.user.create({
            data: {
                email: "zheglisov.k@enu.kz",
                password: teacherPassword,
                name: "Жеглисов Кабыла",
                firstName: "Кабыла",
                lastName: "Жеглисов",
                role: "teacher",
                specialtyCode: "6B06103",
            },
        }),
        prisma.user.create({
            data: {
                email: "zhukabaeva.t@enu.kz",
                password: teacherPassword,
                name: "Жукабаева Тамара Кокеновна",
                firstName: "Тамара",
                lastName: "Жукабаева",
                role: "teacher",
                specialtyCode: "6B06103",
            },
        }),
        prisma.user.create({
            data: {
                email: "makhajanova.u@enu.kz",
                password: teacherPassword,
                name: "Махажанова Улжан Танирбергеновна",
                firstName: "Улжан",
                lastName: "Махажанова",
                role: "teacher",
                specialtyCode: "6B06103",
            },
        }),
        prisma.user.create({
            data: {
                email: "yesenova.m@enu.kz",
                password: teacherPassword,
                name: "Есенова Молдир Балкаировна",
                firstName: "Молдир",
                lastName: "Есенова",
                role: "teacher",
                specialtyCode: "6B06103",
            },
        }),
        prisma.user.create({
            data: {
                email: "akhmetova.a@enu.kz",
                password: teacherPassword,
                name: "Ахметова Айдана Жанатбековна",
                firstName: "Айдана",
                lastName: "Ахметова",
                role: "teacher",
                specialtyCode: "6B06103",
            },
        }),
    ]);

    const [t1, t2, t3, t4, t5] = teachers;

    // ─── Disciplines ──────────────────────────────────────────────────────────
    const disciplines = await Promise.all([
        prisma.discipline.create({
            data: { name: "Информационная безопасность и надёжность ИС", credits: 5, teacherId: t1.id },
        }),
        prisma.discipline.create({
            data: { name: "Проектирование и реализация серверной инфраструктуры", credits: 5, teacherId: t2.id },
        }),
        prisma.discipline.create({
            data: { name: "Программирование мобильных устройств", credits: 5, teacherId: t3.id },
        }),
        prisma.discipline.create({
            data: { name: "Блокчейн технологии", credits: 5, teacherId: t4.id },
        }),
        prisma.discipline.create({
            data: { name: "Программирование в системе «1С:Предприятие 8»", credits: 5, teacherId: t5.id },
        }),
    ]);

    // ─── Classes (one class per discipline, created by teacher) ───────────────
    const classes = await Promise.all(
        disciplines.map((disc) =>
            prisma.class.create({
                data: {
                    name: disc.name,
                    description: `Курс по дисциплине: ${disc.name}. Семестр 2, 2025-2026 уч. год.`,
                    teacherId: disc.teacherId,
                    disciplineId: disc.id,
                    semester: "2025-2026 / 2-й семестр",
                },
            })
        )
    );

    // ─── Students ИС-37 (from База_АЖ-27.xls) ─────────────────────────────────
    const studentsData = [
        { lastName: "Азатұлы", firstName: "Есқат", email: "azatuly.eskat@enu.kz" },
        { lastName: "Альменова", firstName: "Аружан", email: "almenova.aruzhan@enu.kz" },
        { lastName: "Ақжан", firstName: "Расуул", email: "akzhan.rasul@enu.kz" },
        { lastName: "Ауезханов", firstName: "Нұрсейит", email: "auezkhanov.nurseit@enu.kz" },
        { lastName: "Бижанов", firstName: "Адиль", email: "bizhanov.adil@enu.kz" },
        { lastName: "Досмахан", firstName: "Ұлдана", email: "dosmakhan.uldana@enu.kz" },
        { lastName: "Жанпейс", firstName: "Мархулан", email: "zhanpeis.markhulan@enu.kz" },
        { lastName: "Жанысбай", firstName: "Ернұр", email: "zhanysbai.ernur@enu.kz" },
        { lastName: "Жәнібек", firstName: "Нұрмахамбет", email: "zhanibek.nurmakhabet@enu.kz" },
        { lastName: "Жігерлі", firstName: "Нұрсұлу", email: "zhigerli.nursulu@enu.kz" },
        { lastName: "Зияханов", firstName: "Балабек", email: "ziyakhanov.balabek@enu.kz" },
        { lastName: "Исенов", firstName: "Диас", email: "isenov.dias@enu.kz" },
        { lastName: "Қабыкен", firstName: "Байнұржан", email: "kabiken.bainurzhan@enu.kz" },
        { lastName: "Қалмахан", firstName: "Нұрмұхаммед", email: "kalmakhan.nurmukhammed@enu.kz" },
        { lastName: "Қаппас", firstName: "Еркебұлан", email: "kappas.erkebolan@enu.kz" },
        { lastName: "Мәлік", firstName: "Мөлдір", email: "malik.moldir@enu.kz" },
        { lastName: "Маратұлы", firstName: "Ерғазы", email: "maratuly.erghazy@enu.kz" },
        { lastName: "Нұрхазыев", firstName: "Нұрлыбек", email: "nurkhaziev.nurlybek@enu.kz" },
        { lastName: "Нұрболат", firstName: "Ұлнар", email: "nurbolat.ulnar@enu.kz" },
        { lastName: "Орынбек", firstName: "Дінмұхаммед", email: "orynbek.dinmukhammed@enu.kz" },
        { lastName: "Ораз", firstName: "Дінмұхаммед", email: "oraz.dinmukhammed@enu.kz" },
        { lastName: "Рахатұлы", firstName: "Куаныш", email: "rakhатuly.kuanys@enu.kz" },
        { lastName: "Сакен", firstName: "Асылан", email: "saken.asymlan@enu.kz" },
        { lastName: "Сәбитов", firstName: "Азамат", email: "sabitov.azamat@enu.kz" },
        { lastName: "Тоқтаров", firstName: "Саят", email: "toktarov.sayat@enu.kz" },
        { lastName: "Шекер", firstName: "Мейірбек", email: "sheker.meirbek@enu.kz" },
        { lastName: "Турлыбеков", firstName: "Абзал", email: "turlybekov.abzal@enu.kz" },
        { lastName: "Теміржан", firstName: "Жанель", email: "temirkhan.zhanel@enu.kz" },
    ];

    const students = await Promise.all(
        studentsData.map((s) =>
            prisma.user.create({
                data: {
                    email: s.email,
                    password: studentPassword,
                    name: `${s.lastName} ${s.firstName}`,
                    firstName: s.firstName,
                    lastName: s.lastName,
                    group: "ИС-37",
                    specialtyCode: "6B06103",
                    role: "student",
                },
            })
        )
    );

    // ─── Enroll all students in all 5 classes ─────────────────────────────────
    const enrollmentData = students.flatMap((student) =>
        classes.map((cls) => ({
            studentId: student.id,
            classId: cls.id,
        }))
    );

    await prisma.enrollment.createMany({ data: enrollmentData });

    console.log(`✅ Seeded:`);
    console.log(`   - ${teachers.length} teachers`);
    console.log(`   - ${disciplines.length} disciplines`);
    console.log(`   - ${classes.length} classes`);
    console.log(`   - ${students.length} students`);
    console.log(`   - ${enrollmentData.length} enrollments`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
