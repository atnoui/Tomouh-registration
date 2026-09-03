import Image from "next/image";
import { Palette, Users, Film, Megaphone, Code2, Mic2 } from "lucide-react";
import Header from "@/components/Header";
import RegistrationForm from "@/components/RegistrationForm";

const DEPARTMENTS = [
  {
    icon: Palette,
    title: "فرع ديزاين",
    desc: "تصميم الهوية البصرية والمنشورات وكل ما يظهر للجمهور باسم طموح.",
  },
  {
    icon: Users,
    title: "فرع متطوعين",
    desc: "دعم الفعاليات والمهام اليومية أينما احتاج الفريق يداً إضافية.",
  },
  {
    icon: Film,
    title: "فرع مونتاج",
    desc: "تركيب الصوت والصورة وتحويل المادة الخام إلى محتوى جاهز للنشر.",
  },
  {
    icon: Megaphone,
    title: "فرع ميديا",
    desc: "إدارة صفحات التواصل الاجتماعي وصناعة المحتوى اليومي.",
  },
  {
    icon: Code2,
    title: "فريق تقني",
    desc: "بناء وصيانة الأدوات والمنصات الرقمية التي يعمل عليها الفريق.",
  },
  {
    icon: Mic2,
    title: "فرع بودكاست",
    desc: "كتابة سكريبت الحلقات والتعليق الصوتي وراء الميكروفون.",
  },
];

export default function Home() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-gradient pb-24 pt-32 sm:pb-32 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-flame-glow" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
          <Image
            src="/logo-hero.png"
            alt="شعار طموح"
            width={96}
            height={96}
            priority
            className="rounded-2xl shadow-2xl"
          />
          <h1 className="mt-8 font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            طموح بدأ بصوت واحد،
            <br />
            تعال نكبّره معاً.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
            من حلقة بودكاست إلى فريق متكامل يبحث عن أصحاب الشغف ليصنعوا أثراً
            حقيقياً في المجتمع. إن كنت تريد تطوير مهاراتك واكتساب خبرة عمل
            حقيقية بروح الفريق الواحد، مكانك معنا.
          </p>
          <a
            href="#form"
            className="mt-10 rounded-full bg-flame-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-flame-500/30 transition hover:bg-flame-600"
          >
            انضم إلى طموح
          </a>
        </div>
      </section>

      {/* Story */}
      <section className="bg-cream-50 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
            قصتنا
          </h2>
          <p className="mt-6 text-lg leading-loose text-ink/70">
            في البداية، لم يكن طموح سوى فكرة. مجموعة من الشباب قرروا أن التغيير
            لا ينتظر أحداً، فحملوا الميكروفون وأطلقوا بودكاست طموح كأول خطوة في
            الطريق. اليوم تحوّلت تلك الخطوة إلى فريق عمل حقيقي يبحث باستمرار عن
            أشخاص يحملون نفس الشغف: يريدون تطوير مهاراتهم، وخوض تجربة عمل
            جماعي حقيقية، وترك بصمة لا تُنسى.
          </p>
        </div>
      </section>

      {/* Departments */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
            أين تجد نفسك؟
          </h2>
          <p className="mt-3 max-w-xl text-ink/60">
            ستة فروع، وكل واحد منها يحتاج ناساً مختلفين. اختر ما يناسبك — أو
            أكثر من واحد.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DEPARTMENTS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-ink/10 p-6 transition hover:border-flame-500/30 hover:shadow-card"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-800/5">
                  <Icon className="h-5 w-5 text-navy-800" strokeWidth={2} />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration form */}
      <section id="form" className="bg-cream-100 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
              استمارة الانضمام
            </h2>
            <p className="mt-3 text-ink/60">
              ثلاث خطوات قصيرة تفصلك عن الانضمام لفريق طموح.
            </p>
          </div>
          <RegistrationForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center">
          <Image src="/logo.png" alt="طموح" width={40} height={40} />
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} طموح — من فكرة إلى أثر.
          </p>
        </div>
      </footer>
    </>
  );
}
