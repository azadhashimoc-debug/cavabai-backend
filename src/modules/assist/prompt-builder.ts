type StyleSnapshot = {
  preferredLanguage: string;
  communicationTone: string;
  relationshipStyle: string;
  bio: string | null;
  formalityLevel: number;
  humorLevel: number;
  flirtLevel: number;
  brevityLevel: number;
  emojiLevel: number;
  avoidWords: string[];
  favoritePhrases: string[];
};

type MessageExample = {
  text: string;
  platform: string | null;
  context: string | null;
};

type BuildPromptParams = {
  incomingMessage: string;
  mode: string;
  platform: string;
  relationshipContext: string;
  styleProfile: StyleSnapshot;
  examples: MessageExample[];
};

export function buildAssistPrompt(params: BuildPromptParams) {
  const examplesText =
    params.examples.length > 0
      ? params.examples
          .map(
            (example, index) =>
              `${index + 1}. "${example.text}" | platform: ${example.platform ?? "unknown"} | context: ${example.context ?? "unknown"}`,
          )
          .join("\n")
      : "No prior message examples available.";

  return [
    "Sən CavabAI üçün Azərbaycan/Türk danışıq dilində yazan mesaj assistentisən.",
    "Məqsəd gələn mesaj üçün 4 qısa, təbii və real cavab variantı yaratmaqdır.",
    "Qaydalar:",
    "- Cavablar maksimum 1-2 cümlə olsun.",
    "- Həddindən artıq romantik, yapışqan, manipulyativ və ya təzyiq yaradan üslubdan qaç.",
    "- Qarşı tərəfə emosional borc yükləmə.",
    "- Cavablar Android mesajlaşma tətbiqində birbaşa göndərilə biləcək qədər təbii olsun.",
    "- Analiz hissəsi 2-4 cümlə olsun.",
    "- Eyni fikri 4 dəfə təkrar etmə, ton fərqi olsun.",
    `İstifadəçi stili: dil=${params.styleProfile.preferredLanguage}, tone=${params.styleProfile.communicationTone}, relationshipStyle=${params.styleProfile.relationshipStyle}, formality=${params.styleProfile.formalityLevel}/5, humor=${params.styleProfile.humorLevel}/5, flirt=${params.styleProfile.flirtLevel}/5, brevity=${params.styleProfile.brevityLevel}/5, emoji=${params.styleProfile.emojiLevel}/5.`,
    `Bio: ${params.styleProfile.bio ?? "empty"}.`,
    `Qaçınılacaq sözlər: ${params.styleProfile.avoidWords.join(", ") || "none"}.`,
    `Sevdiyi ifadələr: ${params.styleProfile.favoritePhrases.join(", ") || "none"}.`,
    `Mesaj nümunələri:\n${examplesText}`,
    `Platforma: ${params.platform}.`,
    `Münasibət konteksti: ${params.relationshipContext}.`,
    `İstənən ton rejimi: ${params.mode}.`,
    `Gələn mesaj: "${params.incomingMessage}"`,
    'JSON qaytar. Reply label-ları bu dördlükdən seç: "Rahat", "Zarafatlı", "Flirt", "Qısa".',
  ].join("\n");
}
