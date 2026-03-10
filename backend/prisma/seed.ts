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
    await prisma.material.deleteMany();
    await prisma.class.deleteMany();
    await prisma.discipline.deleteMany();
    await prisma.user.deleteMany();

    const studentPassword = await bcrypt.hash("Student123!", 10);
    const teacherPassword = await bcrypt.hash("Teacher123!", 10);
    const adminPassword = await bcrypt.hash("Admin123!", 10);

    // ─── Admin ────────────────────────────────────────────────────────────────
    await prisma.user.create({
        data: {
            email: "admin@enu.kz",
            password: adminPassword,
            name: "Администратор",
            firstName: "Администратор",
            lastName: "",
            role: "admin",
        },
    });

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

    // ─── Students ИС-37 ───────────────────────────────────────────────────────
    const is37Data = [
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
        { lastName: "Рахатұлы", firstName: "Куаныш", email: "rakhatuly.kuanys@enu.kz" },
        { lastName: "Сакен", firstName: "Асылан", email: "saken.asymlan@enu.kz" },
        { lastName: "Сәбитов", firstName: "Азамат", email: "sabitov.azamat@enu.kz" },
        { lastName: "Тоқтаров", firstName: "Саят", email: "toktarov.sayat@enu.kz" },
        { lastName: "Шекер", firstName: "Мейірбек", email: "sheker.meirbek@enu.kz" },
        { lastName: "Турлыбеков", firstName: "Абзал", email: "turlybekov.abzal@enu.kz" },
        { lastName: "Теміржан", firstName: "Жанель", email: "temirkhan.zhanel@enu.kz" },
    ];

    // ─── Students АЖ-31 ───────────────────────────────────────────────────────
    const aj31Data = [
        { lastName: "Абенов", firstName: "Алибек", email: "abenov.alibek.aj31@enu.kz" },
        { lastName: "Аманова", firstName: "Айгерім", email: "amanova.aigerim.aj31@enu.kz" },
        { lastName: "Асанов", firstName: "Ерлан", email: "asanov.erlan.aj31@enu.kz" },
        { lastName: "Ахметова", firstName: "Дина", email: "akhmetova.dina.aj31@enu.kz" },
        { lastName: "Байменов", firstName: "Данияр", email: "baimenov.daniyar.aj31@enu.kz" },
        { lastName: "Болатова", firstName: "Гүлнар", email: "bolatova.gulnar.aj31@enu.kz" },
        { lastName: "Дюсенов", firstName: "Дастан", email: "dyusenov.dastan.aj31@enu.kz" },
        { lastName: "Елемесова", firstName: "Зарина", email: "elemesova.zarina.aj31@enu.kz" },
        { lastName: "Ерғалиев", firstName: "Арман", email: "ergaliev.arman.aj31@enu.kz" },
        { lastName: "Жақыпов", firstName: "Амір", email: "zhakypon.amir.aj31@enu.kz" },
        { lastName: "Жақсыбекова", firstName: "Камила", email: "zhaksybekova.kamila.aj31@enu.kz" },
        { lastName: "Жолдасов", firstName: "Санжар", email: "zholdassov.sanzhar.aj31@enu.kz" },
        { lastName: "Иманова", firstName: "Меруерт", email: "imanova.mervert.aj31@enu.kz" },
        { lastName: "Қадыров", firstName: "Серік", email: "kadyrov.serik.aj31@enu.kz" },
        { lastName: "Қазыбеков", firstName: "Марат", email: "kazybekov.marat.aj31@enu.kz" },
        { lastName: "Қалиева", firstName: "Мадина", email: "kalieva.madina.aj31@enu.kz" },
        { lastName: "Қасымов", firstName: "Тимур", email: "kasymov.timur.aj31@enu.kz" },
        { lastName: "Қожахметов", firstName: "Нұрлан", email: "kozhakhmetov.nurlan.aj31@enu.kz" },
        { lastName: "Мақсатова", firstName: "Назгүл", email: "maksatova.nazgul.aj31@enu.kz" },
        { lastName: "Мұратов", firstName: "Ернар", email: "muratov.ernar.aj31@enu.kz" },
        { lastName: "Нұрланова", firstName: "Сабина", email: "nurlanova.sabina.aj31@enu.kz" },
        { lastName: "Нұрмаханов", firstName: "Алмас", email: "nurmakhanov.almas.aj31@enu.kz" },
        { lastName: "Орманов", firstName: "Жандос", email: "ormanov.zhandos.aj31@enu.kz" },
        { lastName: "Сатыбалдиева", firstName: "Айнур", email: "satybaldiyeva.ainur.aj31@enu.kz" },
        { lastName: "Сейітов", firstName: "Нұрболат", email: "seitov.nurbolat.aj31@enu.kz" },
        { lastName: "Тілеуова", firstName: "Нұргүл", email: "tileuova.nurgul.aj31@enu.kz" },
        { lastName: "Ұзақов", firstName: "Дамир", email: "uzakov.damir.aj31@enu.kz" },
        { lastName: "Хасенова", firstName: "Сауле", email: "khasenova.saule.aj31@enu.kz" },
        { lastName: "Шаяхметов", firstName: "Ерасыл", email: "shayakhmetov.erasyl.aj31@enu.kz" },
        { lastName: "Юсупова", firstName: "Айзат", email: "yusupova.aizat.aj31@enu.kz" },
    ];

    // ─── Students АЖ-33 ───────────────────────────────────────────────────────
    const aj33Data = [
        { lastName: "Адилов", firstName: "Бекзат", email: "adilov.bekzat.aj33@enu.kz" },
        { lastName: "Айтбаева", firstName: "Алия", email: "aitbaeva.aliya.aj33@enu.kz" },
        { lastName: "Алиев", firstName: "Руслан", email: "aliev.ruslan.aj33@enu.kz" },
        { lastName: "Алтынбекова", firstName: "Жазира", email: "altynbekova.zhazira.aj33@enu.kz" },
        { lastName: "Аргынов", firstName: "Тұрар", email: "argynov.turar.aj33@enu.kz" },
        { lastName: "Әбдіқалықов", firstName: "Рамазан", email: "abdikalykov.ramazan.aj33@enu.kz" },
        { lastName: "Бердіқалиев", firstName: "Жеңіс", email: "berdikaliev.zhenis.aj33@enu.kz" },
        { lastName: "Бітімбаева", firstName: "Ұлпан", email: "bitimbaeva.ulpan.aj33@enu.kz" },
        { lastName: "Ғабдуллин", firstName: "Ансар", email: "gabdullin.ansar.aj33@enu.kz" },
        { lastName: "Дәуренбек", firstName: "Айдар", email: "daurenbek.aidar.aj33@enu.kz" },
        { lastName: "Есенғалиева", firstName: "Перизат", email: "esengalyeva.perizat.aj33@enu.kz" },
        { lastName: "Жаңабеков", firstName: "Диас", email: "zhanabekov.dias.aj33@enu.kz" },
        { lastName: "Заурбеков", firstName: "Мансур", email: "zaurbekov.mansur.aj33@enu.kz" },
        { lastName: "Ибрагимова", firstName: "Лейла", email: "ibragimova.leila.aj33@enu.kz" },
        { lastName: "Қаиров", firstName: "Санат", email: "kairov.sanat.aj33@enu.kz" },
        { lastName: "Қарабаев", firstName: "Азамат", email: "karabaev.azamat.aj33@enu.kz" },
        { lastName: "Кенжебаева", firstName: "Дариға", email: "kenzhebaeva.dariga.aj33@enu.kz" },
        { lastName: "Конысбаев", firstName: "Нұрсұлтан", email: "konysbaev.nursultan.aj33@enu.kz" },
        { lastName: "Мамбетова", firstName: "Гүлмира", email: "mambetova.gulnira.aj33@enu.kz" },
        { lastName: "Молдасанов", firstName: "Ерболат", email: "moldasanov.erbolat.aj33@enu.kz" },
        { lastName: "Мырзабеков", firstName: "Асет", email: "myrzabekov.aset.aj33@enu.kz" },
        { lastName: "Оспанова", firstName: "Жұлдыз", email: "ospanova.zhuldyz.aj33@enu.kz" },
        { lastName: "Рахымова", firstName: "Мөлдір", email: "rakhymova.moldir.aj33@enu.kz" },
        { lastName: "Сапарбекова", firstName: "Айым", email: "saparbekova.aiym.aj33@enu.kz" },
        { lastName: "Серікбаев", firstName: "Амангелді", email: "serikbaev.amangeldi.aj33@enu.kz" },
        { lastName: "Сүлейменов", firstName: "Асхат", email: "suleymenov.askhat.aj33@enu.kz" },
        { lastName: "Тасыбеков", firstName: "Жасұлан", email: "tasybekov.zhasulan.aj33@enu.kz" },
        { lastName: "Толеубекова", firstName: "Эльмира", email: "toleubekova.elmira.aj33@enu.kz" },
        { lastName: "Ысқақов", firstName: "Бауыржан", email: "yskakov.bauyrzhan.aj33@enu.kz" },
        { lastName: "Ятаева", firstName: "Динара", email: "yataeva.dinara.aj33@enu.kz" },
    ];

    // ─── Students АЖ-35 ───────────────────────────────────────────────────────
    const aj35Data = [
        { lastName: "Абдрахманов", firstName: "Ерлан", email: "abdrakhmanov.erlan.aj35@enu.kz" },
        { lastName: "Айдарова", firstName: "Зульфия", email: "aidarova.zulfiya.aj35@enu.kz" },
        { lastName: "Алдашев", firstName: "Серікбол", email: "aldashev.serikbol.aj35@enu.kz" },
        { lastName: "Алтынов", firstName: "Нұрдәулет", email: "altynov.nurdaulet.aj35@enu.kz" },
        { lastName: "Аханова", firstName: "Толқын", email: "akhanova.tolkyn.aj35@enu.kz" },
        { lastName: "Бақытбеков", firstName: "Ренат", email: "bakytbekov.renat.aj35@enu.kz" },
        { lastName: "Береков", firstName: "Ахмет", email: "berekov.akhmet.aj35@enu.kz" },
        { lastName: "Бөлекбаева", firstName: "Айсана", email: "bolekbaeva.aisana.aj35@enu.kz" },
        { lastName: "Ғазизов", firstName: "Саят", email: "gazizov.sayat.aj35@enu.kz" },
        { lastName: "Досымбеков", firstName: "Нартай", email: "dosymbekov.nartai.aj35@enu.kz" },
        { lastName: "Еңсепова", firstName: "Асель", email: "yensepova.asel.aj35@enu.kz" },
        { lastName: "Жексенбіна", firstName: "Гаухар", email: "zheksenbiyna.gaukhar.aj35@enu.kz" },
        { lastName: "Зинуллин", firstName: "Рустам", email: "zinullin.rustam.aj35@enu.kz" },
        { lastName: "Ибраев", firstName: "Бақытжан", email: "ibraev.bakyt.aj35@enu.kz" },
        { lastName: "Қабдолова", firstName: "Нұрия", email: "kabdolova.nuriya.aj35@enu.kz" },
        { lastName: "Қалдыбаев", firstName: "Алдияр", email: "kaldybaev.aldiyar.aj35@enu.kz" },
        { lastName: "Кенесов", firstName: "Ерасыл", email: "kenesov.erasyl.aj35@enu.kz" },
        { lastName: "Қошқарбаев", firstName: "Мөлдір", email: "koshkarbaev.moldir.aj35@enu.kz" },
        { lastName: "Лесбеков", firstName: "Мадияр", email: "lesbekov.madiyar.aj35@enu.kz" },
        { lastName: "Мейрамов", firstName: "Айдын", email: "meyramov.aidyn.aj35@enu.kz" },
        { lastName: "Нижонов", firstName: "Темірлан", email: "nizhonov.temirlan.aj35@enu.kz" },
        { lastName: "Нұрмағамбетова", firstName: "Алтынай", email: "nurmagambetova.altynai.aj35@enu.kz" },
        { lastName: "Оразбаева", firstName: "Асыл", email: "orazbaeva.asyl.aj35@enu.kz" },
        { lastName: "Пірәлиев", firstName: "Нұрдос", email: "piraliev.nurdos.aj35@enu.kz" },
        { lastName: "Рустемов", firstName: "Ильяс", email: "rustemov.ilyas.aj35@enu.kz" },
        { lastName: "Сейдахметова", firstName: "Балнұр", email: "seidakhmetova.balnur.aj35@enu.kz" },
        { lastName: "Тоқабаев", firstName: "Алпамыс", email: "tokabaev.alpamys.aj35@enu.kz" },
        { lastName: "Уәли", firstName: "Бегімай", email: "uali.begimay.aj35@enu.kz" },
        { lastName: "Хамзин", firstName: "Нұртас", email: "khamzin.nurtas.aj35@enu.kz" },
        { lastName: "Шарипова", firstName: "Ботагөз", email: "sharipova.botagoz.aj35@enu.kz" },
    ];

    // ─── Students АЖ-39 ───────────────────────────────────────────────────────
    const aj39Data = [
        { lastName: "Аблаев", firstName: "Нұрсұлтан", email: "ablaev.nursultan.aj39@enu.kz" },
        { lastName: "Айтқалиева", firstName: "Томирис", email: "aitkaliyeva.tomiris.aj39@enu.kz" },
        { lastName: "Алиасқаров", firstName: "Самат", email: "aliaskarov.samat.aj39@enu.kz" },
        { lastName: "Аманжолов", firstName: "Бекнұр", email: "amanzholov.beknur.aj39@enu.kz" },
        { lastName: "Ахметжанова", firstName: "Назерке", email: "akhmetjanova.nazerke.aj39@enu.kz" },
        { lastName: "Байғабылов", firstName: "Олжас", email: "baigabylov.olzhas.aj39@enu.kz" },
        { lastName: "Бейсенов", firstName: "Нұрмұхамед", email: "beisenov.nurmukhamet.aj39@enu.kz" },
        { lastName: "Бердібеков", firstName: "Аянбек", email: "berdibekov.ayanbek.aj39@enu.kz" },
        { lastName: "Ғалымова", firstName: "Аяулым", email: "galymova.ayayulym.aj39@enu.kz" },
        { lastName: "Дербісалин", firstName: "Рахмет", email: "derbisalin.rakhmet.aj39@enu.kz" },
        { lastName: "Есбол", firstName: "Арайлым", email: "esbol.arailym.aj39@enu.kz" },
        { lastName: "Жарқынбеков", firstName: "Ержан", email: "zharkynbekov.yerzhan.aj39@enu.kz" },
        { lastName: "Зейнеллина", firstName: "Мариям", email: "zeinellina.mariyam.aj39@enu.kz" },
        { lastName: "Ибатов", firstName: "Қайрат", email: "ibatov.kairat.aj39@enu.kz" },
        { lastName: "Қалижанов", firstName: "Рустем", email: "kalizanov.rustem.aj39@enu.kz" },
        { lastName: "Қаратаева", firstName: "Айдана", email: "karataeva.aidana.aj39@enu.kz" },
        { lastName: "Кәримова", firstName: "Нурай", email: "karimova.nuray.aj39@enu.kz" },
        { lastName: "Кенжебаев", firstName: "Алдияр", email: "kenzhebaev.aldiyar.aj39@enu.kz" },
        { lastName: "Малибеков", firstName: "Сейткали", email: "malibekov.seitkali.aj39@enu.kz" },
        { lastName: "Мирасов", firstName: "Ерлан", email: "mirasov.erlan.aj39@enu.kz" },
        { lastName: "Нұрбаев", firstName: "Тоғжан", email: "nurbaev.togzhan.aj39@enu.kz" },
        { lastName: "Нұрсейітова", firstName: "Ариярка", email: "nurseitova.ariyarka.aj39@enu.kz" },
        { lastName: "Өтеулиев", firstName: "Мұхтар", email: "oteuliеv.mukhtar.aj39@enu.kz" },
        { lastName: "Рысқалиев", firstName: "Жарқын", email: "ryskaliеv.zharkyn.aj39@enu.kz" },
        { lastName: "Сатыбалдин", firstName: "Ерлан", email: "satybaldin.erlan.aj39@enu.kz" },
        { lastName: "Тілепова", firstName: "Аянат", email: "tilepova.ayanat.aj39@enu.kz" },
        { lastName: "Тоқсанов", firstName: "Бауыржан", email: "toksanov.bauyrzhan.aj39@enu.kz" },
        { lastName: "Уразбаева", firstName: "Лаура", email: "urazbaeva.laura.aj39@enu.kz" },
        { lastName: "Хасенов", firstName: "Мағжан", email: "khasenov.magzhan.aj39@enu.kz" },
        { lastName: "Шарманов", firstName: "Арыстан", email: "sharmanov.arystan.aj39@enu.kz" },
    ];

    const createStudents = async (data: { lastName: string; firstName: string; email: string }[], group: string) => {
        return Promise.all(
            data.map((s) =>
                prisma.user.create({
                    data: {
                        email: s.email,
                        password: studentPassword,
                        name: `${s.lastName} ${s.firstName}`,
                        firstName: s.firstName,
                        lastName: s.lastName,
                        group,
                        specialtyCode: "6B06103",
                        role: "student",
                    },
                })
            )
        );
    };

    const studentsIS37 = await createStudents(is37Data, "ИС-37");
    const studentsAJ31 = await createStudents(aj31Data, "АЖ-31");
    const studentsAJ33 = await createStudents(aj33Data, "АЖ-33");
    const studentsAJ35 = await createStudents(aj35Data, "АЖ-35");
    const studentsAJ39 = await createStudents(aj39Data, "АЖ-39");

    // ─── Enroll ИС-37 students in all 5 classes ────────────────────────────────
    const enrollmentData = studentsIS37.flatMap((student) =>
        classes.map((cls) => ({
            studentId: student.id,
            classId: cls.id,
        }))
    );

    await prisma.enrollment.createMany({ data: enrollmentData });

    const totalStudents = studentsIS37.length + studentsAJ31.length + studentsAJ33.length + studentsAJ35.length + studentsAJ39.length;

    console.log(`✅ Seeded:`);
    console.log(`   - 1 admin (admin@enu.kz / Admin123!)`);
    console.log(`   - ${teachers.length} teachers`);
    console.log(`   - ${disciplines.length} disciplines`);
    console.log(`   - ${classes.length} classes`);
    console.log(`   - ${totalStudents} students across 5 groups (ИС-37, АЖ-31, АЖ-33, АЖ-35, АЖ-39)`);
    console.log(`   - ${enrollmentData.length} enrollments (ИС-37 enrolled in all classes)`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
