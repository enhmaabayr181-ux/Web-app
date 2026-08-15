import type {
  CategoryId,
  ComicProject,
  EndingType,
  ProjectSettings,
  StyleId,
  ToneId,
} from "../types";
import { DEFAULT_FRAME_DURATION } from "../constants";

interface Beat {
  text: string;
  scene: string;
  emotion: string;
  visual: string;
}

interface EndingVariant {
  text: string;
  emotion: string;
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return h;
}

/* ---------------------------------------------------------------------- */
/* Character description bank                                             */
/* ---------------------------------------------------------------------- */

const FEMALE_LOOKS = [
  "shoulder-length dark brown hair, soft round face, warm brown eyes, oversized cream sweater",
  "long black hair in a low ponytail, delicate features, freckles, pastel pink hoodie",
  "wavy chestnut hair with soft bangs, gentle smile, oversized beige cardigan",
  "short bob haircut, expressive almond eyes, cozy lavender knit sweater",
];

const MALE_LOOKS = [
  "short black hair, calm expressive eyes, relaxed fit beige sweater",
  "messy dark brown hair, warm smile, oversized denim jacket over a plain tee",
  "neatly combed black hair, sharp gentle features, cream knit sweater",
  "short textured hair, soft eyes, casual pastel hoodie",
];

const COUPLE_LOOKS = [
  "a young Mongolian woman with shoulder-length dark brown hair in an oversized cream sweater, and a young Mongolian man with short black hair in a beige knit sweater",
  "a young Mongolian couple, she with a low ponytail and pastel pink hoodie, he with messy hair and a denim jacket",
];

function buildCharacterDescription(settings: ProjectSettings): string {
  const seed = hashString(settings.topic + settings.style);
  if (settings.mainCharacter === "custom" && settings.customCharacter.trim()) {
    return settings.customCharacter.trim();
  }
  if (settings.mainCharacter === "male") {
    return `Same young Mongolian man, ${pick(MALE_LOOKS, seed)}, consistent facial features across every panel`;
  }
  if (settings.mainCharacter === "couple") {
    return `Same young Mongolian couple, ${pick(COUPLE_LOOKS, seed)}, consistent facial features across every panel`;
  }
  return `Same young Mongolian woman, ${pick(FEMALE_LOOKS, seed)}, consistent facial features across every panel`;
}

/* ---------------------------------------------------------------------- */
/* Style + tone visual language                                           */
/* ---------------------------------------------------------------------- */

const STYLE_SUFFIX: Record<StyleId, string> = {
  modern_pastel: "modern pastel editorial comic style, clean linework, soft flat colors",
  korean_webtoon: "Korean webtoon style, crisp digital lineart, soft cel shading",
  watercolor: "soft watercolor illustration, gentle bleeding edges, paper texture",
  dreamy_illustration: "dreamy illustration style, soft focus, glowing highlights",
  cute_editorial: "cute editorial comic style, bold outlines, playful pastel palette",
  minimal_comic: "minimal comic style, limited color palette, generous negative space",
  cinematic_comic: "cinematic comic style, dramatic shading, film-like framing",
};

const TONE_LIGHTING: Record<ToneId, string> = {
  funny: "bright even lighting, playful mood",
  cute: "soft warm lighting, gentle pastel glow",
  romantic: "warm golden-hour lighting, soft bokeh",
  bright: "clean bright daylight, airy mood",
  sad: "muted cool lighting, soft blue-grey tones, light rain mood",
  dreamy: "soft hazy glow, pastel bokeh, dreamlike atmosphere",
  emotional: "soft directional light, gentle shadows, intimate mood",
  sarcastic: "flat neutral lighting, deadpan expression, slightly desaturated",
};

const PANEL_SHOTS = [
  "medium shot",
  "close-up shot",
  "wide establishing shot",
  "over-the-shoulder shot",
  "close-up on face",
  "medium shot, slight low angle",
];

/* ---------------------------------------------------------------------- */
/* Story arcs — 8 beats per category, in Mongolian                        */
/* ---------------------------------------------------------------------- */

const ARCS: Record<CategoryId, Beat[]> = {
  relationship: [
    { text: "За, бичлээ… одоо л хариу ирэх байх.", scene: "Охин ор дээрээ хэвтээд утсаа харж, зөөлхөн инээмсэглэж байна.", emotion: "Hopeful, cute", visual: "lying on bed, holding phone up, soft smile" },
    { text: "5 минутын дараа…", scene: "Мөн л утсаа дахин шалгаж байна, инээмсэглэл багассан.", emotion: "Slightly impatient", visual: "sitting up, checking phone screen again, subtle frown" },
    { text: "20 минут өнгөрлөө. Online ч харагдахгүй байна.", scene: "Утсаа эргүүлж, дэлгэц рүү шоолж харж байна.", emotion: "Anxious, suspicious", visual: "squinting at phone screen, slightly leaning forward" },
    { text: "Тэгээд өөрийгөө л буруутгаж эхэлдэг.", scene: "Толгойгоо тонгойлгож, гараа духандаа тавьсан.", emotion: "Self-doubt, overthinking", visual: "head down, hand on forehead, phone resting on lap" },
    { text: "„Магадгүй буруу юм бичсэн байх аа?“", scene: "Өмнөх чатаа буцаж уншиж, нүд нь бачимдсан.", emotion: "Worried", visual: "scrolling old messages, worried eyes, tense shoulders" },
    { text: "Гэнэт л… „бичиж байна…“ гэж гарлаа!", scene: "Дэлгэц дээр бичиж буй анимаци, охин шууд босч суулаа.", emotion: "Sudden hope, excited", visual: "sitting up straight, eyes wide, phone held close to chest" },
    { text: "Хариу: „Уучлаарай, ажилтай байсан 😅“", scene: "Мессеж ирэх агшин, амьсгаагаа аль эрхий алдаж байна.", emotion: "Relief", visual: "soft relieved smile, shoulders relaxing, phone glowing softly" },
    { text: "Ингэж л 2 цагийн „роман“ минь тайван өндөрлөдөг.", scene: "Ор руугаа буцаж, утсаа цээж дээрээ тавиад инээмсэглэж байна.", emotion: "Amused, satisfied", visual: "lying back on bed, content smile, phone on chest" },
  ],
  red_flag: [
    { text: "Эхэндээ бүх зүйл төгс мэт санагддаг.", scene: "Хос кофе шоп дотор инээж ярилцаж сууна.", emotion: "Excited, hopeful", visual: "sitting across a small cafe table, warm smiles, leaning in" },
    { text: "Гэнэт л утсаа нуугаад эхэлдэг.", scene: "Тэр хүн утсаа хажуу тийш нь эргүүлж, дэлгэцийг халхалж байна.", emotion: "Suspicious", visual: "phone turned face-down quickly, guarded posture" },
    { text: "„Хуучин найз охинтойгоо хамт байсан“ гэдгээ мартчихаад ярьдаг.", scene: "Ярианы явцад санамсаргүй алдаж хэлчихээд царай нь өөрчлөгдөнө.", emotion: "Shocked", visual: "wide surprised eyes, hand halfway to mouth" },
    { text: "Уучлалт гуйхын оронд чамайг буруутгадаг.", scene: "Тэр хүн гараа сарвайлгаж, буруутгасан хэл ярианы дохио зангаа.", emotion: "Hurt, confused", visual: "defensive body language across the table, hurt expression" },
    { text: "Чиний найз нөхдийг шүүмжилж эхэлдэг.", scene: "Утсаараа найзтайгаа ярьж байхад дэргэдээс нь эсэргүүцсэн харц харагдана.", emotion: "Defensive", visual: "arms crossed, disapproving glance toward phone" },
    { text: "„Магадгүй би л буруу байгаа юм болов уу…“", scene: "Ганцаараа суугаад гараа духандаа тавьж бодолхийлж байна.", emotion: "Self-doubt", visual: "alone on a bench, head down, hand on temple" },
    { text: "Гэтэл нэг өдөр бүх зүйл тодорхой болдог.", scene: "Гэрэлтэй дэлгэц дээрх мессежийг харж, тайван боловч хатуу царайтай болно.", emotion: "Realization", visual: "reading phone screen in soft light, calm but firm expression" },
    { text: "Red flag-ыг эхнээс нь л мэдэрдэг, зүгээр л үл тоомсорлодог.", scene: "Цонхны хажууд зогсоод, тайван инээмсэглэн урагшаа харж байна.", emotion: "Resolute, empowered", visual: "standing tall by a window, calm confident posture" },
  ],
  green_flag: [
    { text: "Анх танилцахдаа л ялгаатай гэдгийг мэдэрдэг.", scene: "Хоёул кофе барьсаар, чин сэтгэлээсээ инээж ярилцаж байна.", emotion: "Hopeful, warm", visual: "genuine laughter, relaxed cafe setting, warm eye contact" },
    { text: "Чиний мессежид үргэлж цагтаа хариу өгдөг.", scene: "Утсан дээрх мессежийн дэлгэцийг харуулж байна, шуурхай хариу.", emotion: "Comforted", visual: "phone screen with quick reply, soft satisfied smile" },
    { text: "Чиний санаа бодлыг үнэхээр сонсдог.", scene: "Нүүр тулж суугаад, анхааралтай чихээ анивчилгүй сонсож байна.", emotion: "Touched", visual: "leaning in, attentive listening posture, soft eye contact" },
    { text: "Найзуудынхаа өмнө чамайг өндрөөр үнэлдэг.", scene: "Олон хүний дунд гараа мөрөн дээр нь тавьж бахархсан харцтай.", emotion: "Proud, valued", visual: "hand on shoulder among a group, proud gentle smile" },
    { text: "Муу өдөртэй үед ч тэвчээртэй хамт байдаг.", scene: "Гунигтай суугаа хүнийхээ хажууд чимээгүй суугаад тэвэрч байна.", emotion: "Comforted", visual: "quiet supportive hug, soft warm lighting" },
    { text: "Хэрүүл гарахад зугтахгүй, ярилцах гэж оролддог.", scene: "Ширээний ард нүүр тулж, тайван байдлаар ярилцаж байна.", emotion: "Mature love", visual: "calm face-to-face conversation, open body language" },
    { text: "Жижиг зүйлсийг санаж, гэнэтийн бэлэг өгдөг.", scene: "Гараараа жижигхэн уут сунгаж өгөхөд гэнэтийн баяр хөөр.", emotion: "Happy, surprised", visual: "handing over a small gift, surprised delighted smile" },
    { text: "Ийм хүнтэй байх нь азын хэрэг биш, зөв сонголтын үр дүн.", scene: "Хоёул гар барьсаар нар жаргах үзэгдэл рүү харж зогсож байна.", emotion: "Grateful, warm", visual: "holding hands, facing a warm sunset skyline" },
  ],
  funny: [
    { text: "Өнөөдрөөс эхлээд бүх зүйлээ цэгцэлнэ гэж шийдсэн.", scene: "Гараа дал дал хийж, тэмдэглэлийн дэвтэртэй сууж байна.", emotion: "Determined", visual: "sitting with a planner and pen, confident determined pose" },
    { text: "Эхлээд л утсаараа „5 минут“ гэж нээсэн.", scene: "Утсаа авч, өгүүлбэрийн доор цаг харуулсан.", emotion: "Casual", visual: "casually opening phone, relaxed slouched posture" },
    { text: "2 цагийн дараа…", scene: "Ор дээрээ хэвтэж утсаа дэгдээж, гэрэл нүүрэнд нь туссан.", emotion: "Guilty, funny", visual: "sprawled on bed, phone glow lighting face, half-lidded eyes" },
    { text: "„За ингээд маргааш л эхэлье“ гэж өөрийгөө тайвшруулдаг.", scene: "Тэнгэр өөд харж, гараа зүрхэн дээрээ тавиад амлалт өгч байна.", emotion: "Self-mocking", visual: "hand over heart, dramatic mock-serious expression" },
    { text: "Ингэж „маргааш“ маань сар болчихдог.", scene: "Хуанли дээр олон өдөр X тэмдэглэгдсэн байдал.", emotion: "Comedic despair", visual: "looking at a calendar full of crossed-out days, comic despair" },
    { text: "Гэнэт нэг мотивацийн видео үзээд дахин „урам орно“.", scene: "Утсаа өндөрт барьж, урам зоригтойгоор харж байна.", emotion: "Hyped", visual: "holding phone up dramatically, eyes sparkling with motivation" },
    { text: "Урам орсны 10 минутын дараа дахиад л утсандаа орчихдог.", scene: "Тэмдэглэлийн дэвтэр орхигдож, дахин утсаа гүйлгэж байна.", emotion: "Funny fail", visual: "notebook abandoned on the side, scrolling phone again" },
    { text: "Ингээд л энэ цикл мөнхөд давтагддаг… 😅", scene: "Хумсаа хазаж, өөрийгөө шоолсон инээмсэглэлтэй камер руу харна.", emotion: "Self-aware, funny", visual: "breaking the fourth wall, playful self-aware smirk to camera" },
  ],
  romantic: [
    { text: "Түүнтэй уулзсан тэр л мөч дэлхий зогссон мэт санагдсан.", scene: "Гудамжинд тааралдаад, хоёулаа зогсоод харц нийлсэн.", emotion: "Dreamy", visual: "standing on a soft-lit street, eyes locked, dreamy soft focus" },
    { text: "Ямар ч үг хэлэлгүй, зөвхөн харц л хангалттай байсан.", scene: "Ширээний ард нүүр тулаад, чимээгүй инээмсэглэж байна.", emotion: "Tender", visual: "quiet cafe table, gentle smiles, soft warm light" },
    { text: "Гар барихад зүрх минь хурдассаар байсан.", scene: "Гар барилцсан ойрхон хараа, гэрэлтсэн нүд.", emotion: "Nervous, warm", visual: "close-up on clasped hands, soft blush on cheeks" },
    { text: "Хамгийн энгийн мөч ч гэсэн чамтай бол онцгой болдог.", scene: "Хоёул нүүрсний зурагт машин дотор дуу сонсож байна.", emotion: "Loving", visual: "sitting together in a car, soft city lights outside" },
    { text: "Шөнө дунд бичсэн мессеж чинь өдрийг минь гэрэлтүүлдэг.", scene: "Харанхуй өрөөнд утасны гэрэл нүүрэнд туссан, зөөлөн инээмсэглэл.", emotion: "Soft", visual: "phone glow in a dark room, soft content smile" },
    { text: "Чамайг харах болгонд дахин дурлачихдаг юм шиг санагддаг.", scene: "Хол зайнаас харж зогсоод, зөөлөн инээмсэглэж байна.", emotion: "Deep love", visual: "watching from across the room, soft admiring gaze" },
    { text: "Хамт өнгөрөх цаг хэзээд хурдан өнгөрдөг.", scene: "Нар жаргах үед гараа сунгаад, цаг харж байна.", emotion: "Bittersweet", visual: "golden hour park bench, glancing at a watch wistfully" },
    { text: "Гэхдээ чамтай бол цаг хугацаа ч зогсчихдог юм шиг.", scene: "Хоёул гар барьсаар нар жаргах өөд харж зогсож байна.", emotion: "Romantic closure", visual: "silhouette holding hands facing a warm sunset" },
  ],
  life: [
    { text: "Насанд хүрэх гэдэг чинь мөрөөдөж байснаас өөр юм байлаа.", scene: "Ажлын ширээний ард ганцаараа сууж, гадагшаа харж байна.", emotion: "Realization", visual: "sitting at a desk, staring out a window, reflective expression" },
    { text: "Өглөө бүр „өнөөдөр л бүгдийг гүйцэтгэнэ“ гэж босдог.", scene: "Ор дээрээс босч, тэмдэглэлийн дэвтэртэй.", emotion: "Determined", visual: "getting out of bed, holding a to-do list, energetic pose" },
    { text: "Тэгээд л жагсаалт дээрх нэг зүйл ч дуусахгүй өнгөрдөг.", scene: "Тэмдэглэлийн дэвтэр дээр олон зүйл огт хасагдаагүй байна.", emotion: "Tired", visual: "looking at an unfinished checklist, tired slumped shoulders" },
    { text: "Тайвшрах цаг гэж бараг байдаггүй.", scene: "Гар утас, компьютер хоёрын хооронд яаран шилжиж байна.", emotion: "Overwhelmed", visual: "juggling phone and laptop, overwhelmed rushed expression" },
    { text: "Гэхдээ жижиг зүйлсээс аз жаргалыг олж сурдаг.", scene: "Цонхны наранд кофены аяга барьж, зөөлөн инээмсэглэж байна.", emotion: "Grateful", visual: "holding a warm mug near a sunny window, soft smile" },
    { text: "Кофены аяга, нарны гэрэл ч хангалттай байдаг үе бий.", scene: "Тайван суугаад, нүдээ аниад амьсгаа авч байна.", emotion: "Calm", visual: "sitting peacefully with eyes closed, warm sunlight" },
    { text: "Насанд хүрэх гэдэг чинь төгс байх биш, зүгээр л үргэлжлүүлэх тухай.", scene: "Гудамжаар алхаж, тайван боловч тодорхой алхамтай.", emotion: "Mature", visual: "walking down a quiet street, calm steady stride" },
    { text: "Өдөр бүр багаар ахиж байгаа нь хангалттай.", scene: "Нар жаргах өөд харж, гараа сунгаад инээмсэглэж байна.", emotion: "Hopeful, steady", visual: "standing on a balcony facing the sunset, calm content smile" },
  ],
  girl_thoughts: [
    { text: "„Энэ хувцас надад зохих уу?“ гэж 10 удаа асуудаг.", scene: "Толины өмнө хувцсаа сольж, эргэн тойрноо шалгаж байна.", emotion: "Self-conscious", visual: "standing in front of a mirror, checking outfit from the side" },
    { text: "Толинд өөрийгөө 20 өнцгөөс шалгадаг.", scene: "Толины өмнө эргэлдэж, өөр өөр өнцгөөс харж байна.", emotion: "Funny, relatable", visual: "turning in front of mirror, examining reflection closely" },
    { text: "Нэг зурагт 50 удаа зураг авдаг.", scene: "Утсаа өргөж, олон удаа зураг авч байна.", emotion: "Perfectionist", visual: "holding phone up taking multiple selfies, focused expression" },
    { text: "„За энэ болъё“ гэж шийдээд гэрээсээ гарахын өмнө дахиад сольдог.", scene: "Хувцасны шүүгээний өмнө хувцас барьж эргэлзэж байна.", emotion: "Indecisive", visual: "standing by an open closet, holding two outfits, indecisive look" },
    { text: "Найз бүсгүйдээ „би хэр харагдаж байна?“ гэж мессеж бичдэг.", scene: "Утсаараа зураг илгээж, хариу хүлээж сууна.", emotion: "Seeking validation", visual: "texting a photo to a friend, anxious hopeful expression" },
    { text: "Гэрээсээ гараад 5 минутын дараа дахин буцаж хувцасаа сольдог.", scene: "Хаалганаас буцаж орж ирж байна, яаравчилсан хөдөлгөөн.", emotion: "Funny", visual: "rushing back through the front door, comically hurried" },
    { text: "Эцэст нь эхний хувцасаа л өмсдөг.", scene: "Эхний сонгосон хувцастайгаа толины өмнө зогсож байна.", emotion: "Ironic", visual: "standing in the very first outfit, mock-realization expression" },
    { text: "Тэгээд „яагаад ингэж удсан юм бэ“ гэж өөрөөсөө асуудаг. 😅", scene: "Хаалганы дэргэд гараа духандаа тавиад инээж байна.", emotion: "Self-aware, funny", visual: "hand on forehead by the door, laughing at herself" },
  ],
  pov: [
    { text: "POV: Чи шалгалтын дүн харах гэж байна.", scene: "Дэлгэц рүү ширтэн, гар чинь курсор дээр хөдөлгөөнгүй зогссон.", emotion: "Nervous anticipation", visual: "hovering hand over laptop trackpad, tense focused stare" },
    { text: "Гар чинь чичирч, дэлгэц рүү харахаас айж байна.", scene: "Гараа дэлгэцийн өмнө зогсоож, нүдээ аньсан.", emotion: "Fear", visual: "trembling hand near screen, eyes squeezed shut" },
    { text: "„Аль хэдийн харчихвал яасан юм бэ“ гэж бодно.", scene: "Толгойгоо сэгсрэн, дотроо тэмцэлдэж байна.", emotion: "Internal conflict", visual: "head tilted, conflicted expression, hand hovering over screen" },
    { text: "3… 2… 1… нүдээ аниад дарна.", scene: "Хуруугаараа дарж, нүдээ аниад толгойгоо буруу тийш эргүүлнэ.", emotion: "Tension", visual: "finger pressing click, face turned away, eyes shut tight" },
    { text: "Нүдээ нээгээд эхлээд юу ч ойлгохгүй байна.", scene: "Дэлгэц рүү ширтэж, царай хөдөлгөөнгүй.", emotion: "Shock, blank", visual: "wide unfocused eyes staring at screen, frozen expression" },
    { text: "Дараа нь аажмаар инээмсэглэл царайд тодорно.", scene: "Уруул нь аажмаар өргөгдөж, нүд гэрэлтэж эхэлнэ.", emotion: "Realization", visual: "slow smile spreading, eyes starting to glisten" },
    { text: "Тэнгэр рүү харан баярласандаа орилно.", scene: "Гараа өргөн, сандлаасаа босч байна.", emotion: "Joy, relief", visual: "standing up from chair, arms raised, joyful shout" },
    { text: "POV: Чи чадсан. Үргэлж л чадаж байсан.", scene: "Цонхны гэрэлд гараа сунгаж, тайван инээмсэглэж байна.", emotion: "Proud, triumphant", visual: "standing by a bright window, calm proud smile" },
  ],
  motivational: [
    { text: "Өнөөдөр хэцүү санагдаж болно.", scene: "Цонхны хажууд ганцаараа сууж, толгойгоо тонгойлгосон.", emotion: "Heavy", visual: "sitting alone near a window, head lowered, quiet mood" },
    { text: "Гэхдээ чи өчигдрөөсөө нэг алхам ахиад л байгаа.", scene: "Аажмаар толгойгоо өргөж, урагшаа харж эхэлнэ.", emotion: "Encouraging", visual: "slowly lifting head, soft determined gaze forward" },
    { text: "Хэн ч чамайг яаж унасныг санахгүй, зөвхөн яаж босохыг чинь санана.", scene: "Сандлаасаа аажмаар босож, мөрөө тэгшлэнэ.", emotion: "Strong", visual: "standing up straight, shoulders back, resolute posture" },
    { text: "Жижиг ахиц ч гэсэн ахиц мөн.", scene: "Тэмдэглэлийн дэвтэрт нэг зүйл тэмдэглэж байна.", emotion: "Supportive", visual: "checking off one small item on a list, gentle satisfaction" },
    { text: "Чи бодож байснаас илүү хүчтэй.", scene: "Толинд өөрийгөө харж, тайван итгэлтэй харцтай.", emotion: "Empowering", visual: "looking in mirror, steady confident eye contact" },
    { text: "Тэвчээр алдах хэрэггүй, зам чинь зөв байна.", scene: "Урт зам дагуу алхаж, нар мандаж байна.", emotion: "Reassuring", visual: "walking a long path at sunrise, calm steady pace" },
    { text: "Өнөөдрийн хүчин чармайлт маргаашийн үр дүн болно.", scene: "Гараа өргөж, нар мандах өөд харж байна.", emotion: "Inspiring", visual: "arms open facing sunrise, hopeful expression" },
    { text: "Зогсоод байгаа хүн бол л ялагдана. Чи бол алхаж л байна.", scene: "Замын үзүүрт зогсоод, өөдөө тодорхой харцтай.", emotion: "Triumphant, motivating", visual: "standing tall at the top of a path, confident forward gaze" },
  ],
  custom: [
    { text: "Энэ бол зүгээр нэг энгийн өдөр мэт эхэлсэн.", scene: "Өдрийн энгийн орчинд ямар ч тусгай зүйлгүй сууж байна.", emotion: "Neutral", visual: "ordinary indoor setting, relaxed neutral posture" },
    { text: "Гэтэл гэнэт бүх зүйл өөрчлөгдөж эхэлсэн.", scene: "Гэнэтийн дуу чимээ сонсогдож, толгойгоо эргүүлнэ.", emotion: "Surprise", visual: "turning head sharply toward something offscreen, surprised look" },
    { text: "Юу хийхээ ч мэдэхгүй, зүрх дэлсэж байсан.", scene: "Гараа цээжин дээрээ тавьж, амьсгаадан зогсож байна.", emotion: "Anxious", visual: "hand on chest, wide anxious eyes, tense stance" },
    { text: "Гэхдээ зогсох аргагүй, үргэлжлүүлэх л хэрэгтэй байсан.", scene: "Гараа шамлан, урагшаа алхаж эхэлнэ.", emotion: "Determined", visual: "stepping forward with resolve, focused expression" },
    { text: "Алхам алхмаар бүх зүйл тодорхой болж эхэлсэн.", scene: "Тайвширсан байдалтай, дэргэдэх зүйлсээ ажиглаж байна.", emotion: "Clarity", visual: "calmly observing surroundings, relaxed clear expression" },
    { text: "Хамгийн хэцүү хэсэг нь аль хэдийн өнгөрчихсөн байв.", scene: "Гэрэлтэй зам дагуу алхаж, амьсгаа тайвширна.", emotion: "Relief", visual: "walking down a brightening path, shoulders relaxing" },
    { text: "Эцэст нь юу ч байсан үнэ цэнэтэй сорилт байлаа.", scene: "Гараа цээжин дээрээ тавиад, тайван инээмсэглэнэ.", emotion: "Reflective", visual: "hand over heart, soft reflective smile" },
    { text: "Тэгээд л энэ бүхэн эхэлсэн газраасаа арай өөр газарт төгсдөг.", scene: "Шинэ орчинд зогсоод, өөдөө тодорхой харцтай.", emotion: "Satisfying closure", visual: "standing in a new bright setting, calm confident gaze" },
  ],
};

/* ---------------------------------------------------------------------- */
/* Endings by ending-type                                                 */
/* ---------------------------------------------------------------------- */

const ENDING_VARIANTS: Record<CategoryId, Record<EndingType, EndingVariant>> = {
  relationship: {
    punchline: { text: "Ингэж л 2 цагийн „роман“ минь тайван өндөрлөдөг.", emotion: "Amused, satisfied" },
    emotional: { text: "Заримдаа хамгийн жижиг мессеж хамгийн их түгшээдэг.", emotion: "Tender, reflective" },
    question: { text: "Та нар ч гэсэн ингэж хариу хүлээж байсан уу?", emotion: "Curious, inviting" },
    no_cta: { text: "…", emotion: "Calm, quiet" },
  },
  red_flag: {
    punchline: { text: "Red flag-ыг эхнээс нь л мэдэрдэг, зүгээр л үл тоомсорлодог.", emotion: "Resolute, empowered" },
    emotional: { text: "Заримдаа хамгийн хэцүү нь мэдсээр байж явахгүй байх явдал.", emotion: "Reflective" },
    question: { text: "Чи хэдэн red flag-ыг үл тоомсорлож байсан бэ?", emotion: "Curious, inviting" },
    no_cta: { text: "…", emotion: "Calm, resolute" },
  },
  green_flag: {
    punchline: { text: "Ийм хүнтэй байх нь азын хэрэг биш, зөв сонголтын үр дүн.", emotion: "Grateful, warm" },
    emotional: { text: "Жижиг анхаарал халамж л хамгийн том green flag байдаг.", emotion: "Warm, tender" },
    question: { text: "Чиний хувьд хамгийн том green flag юу вэ?", emotion: "Curious, inviting" },
    no_cta: { text: "…", emotion: "Warm, quiet" },
  },
  funny: {
    punchline: { text: "Ингээд л энэ цикл мөнхөд давтагддаг… 😅", emotion: "Self-aware, funny" },
    emotional: { text: "Гэхдээ маргааш дахиад л оролдоно шүү дээ.", emotion: "Soft, encouraging" },
    question: { text: "Танайх ч гэсэн ингэж „маргааш“ болгодог уу?", emotion: "Curious, playful" },
    no_cta: { text: "…", emotion: "Playful, quiet" },
  },
  romantic: {
    punchline: { text: "Гэхдээ чамтай бол цаг хугацаа ч зогсчихдог юм шиг.", emotion: "Romantic closure" },
    emotional: { text: "Ийм жижиг мөчүүд л хамгийн урт сайхнаар санагддаг.", emotion: "Tender, wistful" },
    question: { text: "Хамгийн сүүлд ийм мөч мэдэрсэн чинь хэзээ вэ?", emotion: "Curious, soft" },
    no_cta: { text: "…", emotion: "Dreamy, quiet" },
  },
  life: {
    punchline: { text: "Өдөр бүр багаар ахиж байгаа нь хангалттай.", emotion: "Hopeful, steady" },
    emotional: { text: "Заримдаа зүгээр л амьд байгаад талархах хэрэгтэй.", emotion: "Grateful, calm" },
    question: { text: "Өнөөдөр чамайг юу баярлуулсан бэ?", emotion: "Curious, warm" },
    no_cta: { text: "…", emotion: "Calm, quiet" },
  },
  girl_thoughts: {
    punchline: { text: "Тэгээд „яагаад ингэж удсан юм бэ“ гэж өөрөөсөө асуудаг. 😅", emotion: "Self-aware, funny" },
    emotional: { text: "Гэхдээ эцэст нь өөртөө таалагдсан нь хамгийн чухал.", emotion: "Soft, affirming" },
    question: { text: "Та нар ч гэсэн ингэж удаан бэлддэг үү?", emotion: "Curious, playful" },
    no_cta: { text: "…", emotion: "Playful, quiet" },
  },
  pov: {
    punchline: { text: "POV: Чи чадсан. Үргэлж л чадаж байсан.", emotion: "Proud, triumphant" },
    emotional: { text: "Заримдаа өөрийгөө итгэхээс өөр аргагүй байдаг.", emotion: "Tender, reflective" },
    question: { text: "Чи сүүлд хэзээ ингэж өөртөө итгэж байсан бэ?", emotion: "Curious, warm" },
    no_cta: { text: "…", emotion: "Calm, proud" },
  },
  motivational: {
    punchline: { text: "Зогсоод байгаа хүн бол л ялагдана. Чи бол алхаж л байна.", emotion: "Triumphant, motivating" },
    emotional: { text: "Чи мэдэхээс илүү удаан замыг туулж байна, тэсвэрлээрэй.", emotion: "Reassuring, warm" },
    question: { text: "Өнөөдөр чи ямар жижиг алхам хийх вэ?", emotion: "Curious, encouraging" },
    no_cta: { text: "…", emotion: "Calm, strong" },
  },
  custom: {
    punchline: { text: "Тэгээд л энэ бүхэн эхэлсэн газраасаа арай өөр газарт төгсдөг.", emotion: "Satisfying closure" },
    emotional: { text: "Заримдаа зам өөрөө хариултаас илүү чухал байдаг.", emotion: "Reflective" },
    question: { text: "Чиний түүх одоо хаана явж байна вэ?", emotion: "Curious, inviting" },
    no_cta: { text: "…", emotion: "Calm, quiet" },
  },
};

/* ---------------------------------------------------------------------- */
/* Titles + hooks                                                         */
/* ---------------------------------------------------------------------- */

const TITLES: Record<CategoryId, string[]> = {
  relationship: ["Хариу хүлээгээд л…", "2 цагийн „bichij baina“", "Онлайн харагдаад, чат чимээгүй"],
  red_flag: ["Эхэндээ мэдрэгдэхгүй байдаг…", "Red flag, гэхдээ pink шиг харагддаг", "Тэр үед л ойлгосон"],
  green_flag: ["Ийм хүн ховор байдаг", "Green flag жагсаалт", "Жинхэнэ санаа тавьдаг гэдэг"],
  funny: ["Маргааш эхэлнэ гэсэн чинь…", "Productive болно гэж бодсон өдөр", "5 минут гэснээс 2 цаг"],
  romantic: ["Тэр л мөч", "Чамтай бол цаг зогсдог", "Хамгийн энгийн мөч"],
  life: ["Насанд хүрэх гэдэг чинь…", "Өдөр тутмын жижиг тэмцэл", "Том болно гэдэг тухай хэн ч хэлээгүй"],
  girl_thoughts: ["Гарахын өмнөх сүүлийн 20 минут", "„Энэ хувцас надад зохих уу?“", "Толины өмнөх бодол"],
  pov: ["POV: Дүн харах гэж байна", "POV: Хамгийн урт 10 секунд", "POV сери"],
  motivational: ["Өнөөдөр хэцүү байсан бол…", "Жижиг алхам ч гэсэн алхам", "Чи бодож байснаас хүчтэй"],
  custom: ["Энгийн өдрөөс эхэлсэн түүх", "Хүлээгдээгүй эргэлт", "Тэр мөчөөс хойш"],
};

const HOOKS: Record<CategoryId, string[]> = {
  relationship: ["Тэр хариу бичихгүй 2 цаг болоход…", "Би: „Надад хамаагүй ээ.“", "Online харагдаад чат чимээгүй байхад…"],
  red_flag: ["Эхэндээ бүх зүйл төгс мэт санагддаг…", "„Найз охинтой байсан“ гэдгээ мартаад ярихад нь…", "Red flag эхнээсээ л харагддаг байсан…"],
  green_flag: ["Ийм хүн олдоход амьдрал өөрчлөгддөг…", "Чиний мессежид үргэлж хариу өгдөг хүнтэй болоход…", "Жинхэнэ санаа тавьдаг хүн ийм байдаг…"],
  funny: ["„5 минут“ гэж бодсон чинь 2 цаг болчихсон…", "Маргааш эхэлнэ гэж хэдэн жил хэлж байгаа бэ?", "Дахиад л „маргааш“ боллоо…"],
  romantic: ["Тэр л мөчид дэлхий зогссон мэт санагдсан…", "Гар барихад зүрх минь хурдассан…", "Чамайг харах болгонд дахин дурлачихдаг…"],
  life: ["Насанд хүрэх гэдэг чинь тэгж байгаагүй…", "Өглөө бүр „өнөөдөр л бүгдийг гүйцэтгэнэ“ гэж босдог…", "Том болно гэдэг тухай хэн ч сануулаагүй…"],
  girl_thoughts: ["Гэрээсээ гарахын өмнөх сүүлийн 20 минут…", "„Энэ хувцас надад зохих уу?“ — өдөрт 10 удаа…", "Толины өмнө зогсоод…"],
  pov: ["POV: Чи дүнгээ харах гэж байна…", "POV: Гар чинь чичирч байна…", "POV: 3… 2… 1…"],
  motivational: ["Өнөөдөр хэцүү санагдаж байгаа бол эхлээд энийг унш…", "Чи бодож байснаас илүү хүчтэй…", "Зогсохгүй л байгаа нь чинь аль хэдийн ялалт…"],
  custom: ["Энэ бол зүгээр л нэг энгийн өдрөөр эхэлсэн…", "Юу болохыг хэн ч мэдээгүй байсан…", "Тэр мөчөөс хойш бүх зүйл өөрчлөгдсөн…"],
};

/* ---------------------------------------------------------------------- */
/* Captions + hashtags                                                    */
/* ---------------------------------------------------------------------- */

const CAPTIONS: Record<CategoryId, { short: string; relatable: string; emotional: string }> = {
  relationship: {
    short: "Хариу хүлээх мэдрэмж хэн бүхэнд танил байх 😅",
    relatable: "Chat чимээгүй байхад толгойд мянган юм эргэлддэг тийм үү? Comment-д бичээрэй 👇",
    emotional: "Заримдаа хамгийн жижиг зүйл л хамгийн их түгшээдэг.",
  },
  red_flag: {
    short: "Red flag-ыг таньж сурцгаая 🚩",
    relatable: "Чи ч гэсэн ийм зүйл мэдэрч байсан уу? Comment-д хуваалцаарай 👇",
    emotional: "Өөрийгөө хамгаалах эрх чинь үргэлж чинийх шүү.",
  },
  green_flag: {
    short: "Жинхэнэ санаа тавих гэдэг ийм байдаг 💚",
    relatable: "Чиний хажууд ийм хүн байгаа юу? Tag хийгээрэй 👇",
    emotional: "Ийм халамжийг хүлээн авах эрхтэй гэдгээ бүү мартаарай.",
  },
  funny: {
    short: "„Маргааш“ гэдэг үг хамгийн аюултай үг 😂",
    relatable: "Чи ч гэсэн ингэж „productive“ болно гэж бодсон уу? 👇",
    emotional: "Гэхдээ өөртөө хэт хатуу бүү хандаарай.",
  },
  romantic: {
    short: "Зарим мөч үгээр илэрхийлэхэд хэцүү байдаг 💕",
    relatable: "Хамгийн сүүлд ингэж мэдэрсэн чинь хэзээ вэ? Comment-д бич 👇",
    emotional: "Жинхэнэ дулаан мэдрэмж цөөхөн байдаг, олдвол бүү алдаарай.",
  },
  life: {
    short: "Насанд хүрэх гэдэг чинь тэгж байгаагүй л дээ 🥲",
    relatable: "Чи ч гэсэн ингэж мэдэрдэг үү? Comment-д бич 👇",
    emotional: "Өдөр бүр багаар ахиж байгаад л талархъя.",
  },
  girl_thoughts: {
    short: "Гарахын өмнөх энэ 20 минут… 😅",
    relatable: "Чи ч гэсэн ингэж хэдэн удаа хувцасаа сольдог уу? 👇",
    emotional: "Эцэст нь өөртөө таалагдсан нь хамгийн чухал.",
  },
  pov: {
    short: "POV: Хамгийн урт 10 секунд ⏱️",
    relatable: "Чи ч гэсэн ингэж мэдэрч байсан уу? Comment-д бич 👇",
    emotional: "Заримдаа өөртөө итгэхээс өөр аргагүй байдаг.",
  },
  motivational: {
    short: "Чи бодож байснаас илүү хүчтэй 💪",
    relatable: "Өнөөдөр чамайг юу зогсоож байна вэ? Comment-д бич 👇",
    emotional: "Жижиг ахиц ч гэсэн ахиц мөн, бүү мартаарай.",
  },
  custom: {
    short: "Энэ түүх чиний өөрийн түүх байж магадгүй ✨",
    relatable: "Чиний түүх ямар вэ? Comment-д хуваалц 👇",
    emotional: "Заримдаа зам өөрөө хариултаас илүү чухал байдаг.",
  },
};

const COMMON_HASHTAGS = ["#монголтикток", "#mongolia", "#reels", "#монголреел", "#relatable", "#comicreel", "#story"];

const CATEGORY_HASHTAGS: Record<CategoryId, string[]> = {
  relationship: ["#харилцаа", "#relationship", "#chat", "#хайрдуртай"],
  red_flag: ["#redflag", "#dating", "#сануул"],
  green_flag: ["#greenflag", "#healthyrelationship"],
  funny: ["#хөгжилтэй", "#funny", "#өдөртутам"],
  romantic: ["#романтик", "#romantic", "#хайр"],
  life: ["#амьдрал", "#life", "#adulting"],
  girl_thoughts: ["#охидынбодол", "#girlthoughts", "#getreadywithme"],
  pov: ["#pov", "#povreel"],
  motivational: ["#урамзориг", "#motivation", "#хичээцгээе"],
  custom: ["#түүх", "#story"],
};

/* ---------------------------------------------------------------------- */
/* Frame selection: compress an 8-beat arc down to N frames               */
/* ---------------------------------------------------------------------- */

function selectBeats(arc: Beat[], count: number): Beat[] {
  if (count >= arc.length) return arc;
  if (count <= 1) return [arc[arc.length - 1]];

  // Evenly spaced indices across the arc, guaranteed strictly increasing
  // and within bounds — no iterative search, so it always terminates.
  const raw = Array.from({ length: count }, (_, i) =>
    Math.round((i * (arc.length - 1)) / (count - 1)),
  );
  const indices: number[] = [];
  let last = -1;
  for (const idx of raw) {
    const v = Math.max(idx, last + 1);
    indices.push(v);
    last = v;
  }
  const overflow = indices[indices.length - 1] - (arc.length - 1);
  if (overflow > 0) {
    for (let i = indices.length - 1; i >= 0; i--) {
      indices[i] = Math.min(indices[i], arc.length - 1 - (indices.length - 1 - i));
    }
  }

  return indices.map((i) => arc[i]);
}

function trimTopic(topic: string): string {
  const clean = topic.trim().replace(/[\n\r]+/g, " ");
  if (clean.length <= 70) return clean;
  return clean.slice(0, 67).trimEnd() + "…";
}

export function buildImagePrompt(
  characterDescription: string,
  beat: Beat,
  style: StyleId,
  tone: ToneId,
  frameIndex: number,
): string {
  const shot = PANEL_SHOTS[frameIndex % PANEL_SHOTS.length];
  return [
    `${characterDescription}.`,
    `${beat.visual}, ${shot}.`,
    `Facial expression: ${beat.emotion.toLowerCase()}.`,
    `${TONE_LIGHTING[tone]}.`,
    `${STYLE_SUFFIX[style]}.`,
    `Vertical 9:16 comic panel composition, single character focus, clean background.`,
  ].join(" ");
}

export function generateComicProject(settings: ProjectSettings): ComicProject {
  const seed = hashString(settings.topic + settings.category + settings.tone);
  const category = settings.category;
  const arc = ARCS[category];
  const beats = selectBeats(arc, settings.frameCount);
  const characterDescription = buildCharacterDescription(settings);

  const ending = ENDING_VARIANTS[category][settings.endingType];
  const lastBeat: Beat = {
    ...beats[beats.length - 1],
    text: ending.text,
    emotion: ending.emotion,
  };
  const framesSource = [...beats.slice(0, -1), lastBeat];

  const frames = framesSource.map((beat, idx) => ({
    id: idx + 1,
    text: beat.text,
    scene: beat.scene,
    emotion: beat.emotion,
    imagePrompt: buildImagePrompt(characterDescription, beat, settings.style, settings.tone, idx),
    duration: DEFAULT_FRAME_DURATION,
  }));

  const title =
    category === "custom" && settings.customCategory.trim()
      ? `„${trimTopic(settings.customCategory)}“`
      : pick(TITLES[category], seed);

  const hookBase = pick(HOOKS[category], seed + 1);
  const hook = settings.topic.trim() ? hookBase : hookBase;

  const captionBank = CAPTIONS[category];
  const hashtagPool = Array.from(new Set([...CATEGORY_HASHTAGS[category], ...COMMON_HASHTAGS]));
  const hashtagCount = 5 + (Math.abs(seed) % 4); // 5-8
  const hashtags = hashtagPool
    .slice()
    .sort((a, b) => (hashString(a + seed) % 7) - (hashString(b + seed) % 7))
    .slice(0, Math.min(hashtagCount, hashtagPool.length));

  return {
    title,
    hook,
    character: characterDescription,
    frames,
    ending: ending.text,
    captions: {
      short: captionBank.short,
      relatable: captionBank.relatable,
      emotional: captionBank.emotional,
    },
    hashtags,
  };
}

export function regenerateFrame(
  settings: ProjectSettings,
  frameIndex: number,
  frameCountTotal: number,
): { text: string; scene: string; emotion: string; imagePrompt: string } {
  const arc = ARCS[settings.category];
  const beats = selectBeats(arc, frameCountTotal);
  const pool = arc.filter((b) => !beats.includes(b));
  const source = pool.length > 0 ? pool[Math.abs(hashString(settings.topic) + frameIndex + Date.now()) % pool.length] : beats[frameIndex % beats.length];
  const characterDescription = buildCharacterDescription(settings);
  return {
    text: source.text,
    scene: source.scene,
    emotion: source.emotion,
    imagePrompt: buildImagePrompt(characterDescription, source, settings.style, settings.tone, frameIndex),
  };
}

export const MOCK_GENERATION_DELAY_MS = 900;
