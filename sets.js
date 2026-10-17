const sets = [
  {
    id: "essentials",
    name: "SAT essentials",
    cards: [
      { word: "aberrant", pos: "adjective", phonetic: "/əˈberənt/", translation: "khác thường, đi lệch khỏi chuẩn mực", synonyms: ["atypical", "unusual", "deviant"], example: "The scientist repeated the trial after noticing an aberrant result." },
      { word: "candid", pos: "adjective", phonetic: "/ˈkændɪd/", translation: "thẳng thắn, chân thật", synonyms: ["frank", "honest", "outspoken"], example: "Her candid feedback helped the team improve its proposal." },
      { word: "concede", pos: "verb", phonetic: "/kənˈsiːd/", translation: "thừa nhận; nhượng bộ", synonyms: ["admit", "acknowledge", "yield"], example: "After reviewing the new evidence, the author had to concede her point." },
      { word: "diligent", pos: "adjective", phonetic: "/ˈdɪlɪdʒənt/", translation: "siêng năng, cần cù", synonyms: ["assiduous", "industrious", "thorough"], example: "His diligent research uncovered a pattern in the historical records." },
      { word: "discrepancy", pos: "noun", phonetic: "/dɪˈskrepənsi/", translation: "sự khác biệt, điểm không nhất quán", synonyms: ["inconsistency", "difference", "divergence"], example: "The auditor noticed a discrepancy between the two reports." },
      { word: "eloquent", pos: "adjective", phonetic: "/ˈeləkwənt/", translation: "hùng hồn, diễn đạt lưu loát", synonyms: ["articulate", "expressive", "persuasive"], example: "Her eloquent speech made a complex issue feel clear." },
      { word: "mitigate", pos: "verb", phonetic: "/ˈmɪtɪɡeɪt/", translation: "làm giảm nhẹ, xoa dịu", synonyms: ["alleviate", "lessen", "ease"], example: "Planting trees can help mitigate the effects of extreme heat." },
      { word: "pragmatic", pos: "adjective", phonetic: "/præɡˈmætɪk/", translation: "thực tế, chú trọng tính khả thi", synonyms: ["practical", "sensible", "realistic"], example: "They chose a pragmatic solution that fit the time they had." }
    ]
  },
  {
    id: "academic-verbs",
    name: "Academic verbs",
    cards: [
      { word: "advocate", pos: "verb", phonetic: "/ˈædvəkeɪt/", translation: "ủng hộ, công khai tán thành", synonyms: ["support", "champion", "promote"], example: "The essay advocates a gradual approach to reform." },
      { word: "compile", pos: "verb", phonetic: "/kəmˈpaɪl/", translation: "tập hợp, biên soạn", synonyms: ["assemble", "collect", "gather"], example: "Researchers compiled data from several independent studies." },
      { word: "corroborate", pos: "verb", phonetic: "/kəˈrɑːbəreɪt/", translation: "xác nhận bằng bằng chứng", synonyms: ["confirm", "verify", "support"], example: "A second witness corroborated the account of the event." },
      { word: "elucidate", pos: "verb", phonetic: "/ɪˈluːsɪdeɪt/", translation: "làm sáng tỏ, giải thích rõ", synonyms: ["clarify", "explain", "illuminate"], example: "The diagram elucidates how the two systems interact." },
      { word: "formulate", pos: "verb", phonetic: "/ˈfɔːrmjəleɪt/", translation: "xây dựng, diễn đạt thành hệ thống", synonyms: ["devise", "develop", "express"], example: "The team formulated a hypothesis before collecting more samples." },
      { word: "infer", pos: "verb", phonetic: "/ɪnˈfɜːr/", translation: "suy luận từ bằng chứng", synonyms: ["deduce", "conclude", "derive"], example: "From the layered rock, geologists inferred that the valley was once underwater." },
      { word: "refute", pos: "verb", phonetic: "/rɪˈfjuːt/", translation: "bác bỏ bằng lập luận hoặc bằng chứng", synonyms: ["disprove", "rebut", "counter"], example: "Later experiments refuted the original claim." },
      { word: "substantiate", pos: "verb", phonetic: "/səbˈstænʃieɪt/", translation: "chứng minh bằng bằng chứng", synonyms: ["validate", "verify", "confirm"], example: "The newly discovered letters substantiate the historian’s theory." }
    ]
  },
  {
    id: "reading-rhetoric",
    name: "Reading & rhetoric",
    cards: [
      { word: "ambiguity", pos: "noun", phonetic: "/ˌæmbɪˈɡjuːəti/", translation: "sự mơ hồ, có thể hiểu theo nhiều cách", synonyms: ["uncertainty", "vagueness", "equivocation"], example: "The poem’s ambiguity invites several interpretations." },
      { word: "connotation", pos: "noun", phonetic: "/ˌkɑːnəˈteɪʃən/", translation: "sắc thái nghĩa gợi liên tưởng", synonyms: ["implication", "association", "undertone"], example: "Although both words name a home, one has a warmer connotation." },
      { word: "diction", pos: "noun", phonetic: "/ˈdɪkʃən/", translation: "cách lựa chọn và sử dụng từ ngữ", synonyms: ["word choice", "phrasing", "language"], example: "The author’s formal diction creates a measured tone." },
      { word: "impartial", pos: "adjective", phonetic: "/ɪmˈpɑːrʃəl/", translation: "công bằng, không thiên vị", synonyms: ["neutral", "unbiased", "objective"], example: "An impartial review considered evidence from both sides." },
      { word: "nuance", pos: "noun", phonetic: "/ˈnuːɑːns/", translation: "sắc thái tinh tế, khác biệt nhỏ", synonyms: ["subtlety", "distinction", "shade"], example: "A close reading reveals a nuance in the speaker’s attitude." },
      { word: "paradox", pos: "noun", phonetic: "/ˈpærədɑːks/", translation: "nghịch lý, điều có vẻ mâu thuẫn", synonyms: ["contradiction", "puzzle", "inconsistency"], example: "The passage explores the paradox of gaining freedom through routine." },
      { word: "rhetoric", pos: "noun", phonetic: "/ˈretərɪk/", translation: "nghệ thuật lập luận và thuyết phục", synonyms: ["persuasion", "oratory", "discourse"], example: "The speech’s rhetoric appeals to shared responsibility." },
      { word: "scrutinize", pos: "verb", phonetic: "/ˈskruːtənaɪz/", translation: "xem xét kỹ lưỡng", synonyms: ["inspect", "examine", "analyze"], example: "Readers should scrutinize the source before accepting its conclusion." }
    ]
  }
];