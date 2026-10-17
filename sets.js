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
  },
  {
    "id": "kiki-vocabulary",
    "name": "Kiki SAT vocabulary",
    "cards": [
      {
        "word": "abate",
        "pos": "verb",
        "phonetic": "/əˈbeɪt/",
        "translation": "Làm dịu đi, sụt giảm",
        "synonyms": [
          "diminish",
          "subside",
          "decrease"
        ],
        "example": "The storm finally abated, allowing us to go outside."
      },
      {
        "word": "aberration",
        "pos": "noun",
        "phonetic": "/ˌæb.əˈreɪ.ʃən/",
        "translation": "Sự khác thường, độ lệch",
        "synonyms": [
          "anomaly",
          "deviation",
          "abnormality"
        ],
        "example": "The drop in sales was an aberration."
      },
      {
        "word": "abstain",
        "pos": "verb",
        "phonetic": "/æbˈsteɪn/",
        "translation": "Kiêng, nhịn, từ bỏ",
        "synonyms": [
          "refrain",
          "withhold"
        ],
        "example": "He took a vow to abstain from smoking."
      },
      {
        "word": "adversity",
        "pos": "noun",
        "phonetic": "/ədˈvɜː.sə.ti/",
        "translation": "Nghịch cảnh, rủi ro",
        "synonyms": [
          "hardship",
          "difficulty"
        ],
        "example": "She showed courage in the face of adversity."
      },
      {
        "word": "aesthetic",
        "pos": "adjective",
        "phonetic": "/esˈθet.ɪk/",
        "translation": "Thuộc về thẩm mỹ",
        "synonyms": [
          "artistic",
          "beautiful"
        ],
        "example": "The building has little aesthetic appeal."
      },
      {
        "word": "ameliorate",
        "pos": "verb",
        "phonetic": "/əˈmiː.li.ə.reɪt/",
        "translation": "Cải thiện, làm tốt hơn",
        "synonyms": [
          "improve",
          "enhance"
        ],
        "example": "Steps have been taken to ameliorate the situation."
      },
      {
        "word": "amicable",
        "pos": "adjective",
        "phonetic": "/ˈæm.ɪ.kə.bəl/",
        "translation": "Thân thiện, hòa giải",
        "synonyms": [
          "friendly",
          "cordial"
        ],
        "example": "His manner was perfectly amicable."
      },
      {
        "word": "anachronistic",
        "pos": "adjective",
        "phonetic": "/əˌnæk.rəˈnɪs.tɪk/",
        "translation": "Sai năm tháng, lỗi thời",
        "synonyms": [
          "outdated",
          "misplaced in time"
        ],
        "example": "The costume was anachronistic for a Victorian play."
      },
      {
        "word": "anomaly",
        "pos": "noun",
        "phonetic": "/əˈnɒm.ə.li/",
        "translation": "Sự bất thường",
        "synonyms": [
          "irregularity",
          "oddity"
        ],
        "example": "There are a number of anomalies in the present system."
      },
      {
        "word": "apathy",
        "pos": "noun",
        "phonetic": "/ˈæp.ə.θi/",
        "translation": "Sự thờ ơ, vô cảm",
        "synonyms": [
          "indifference",
          "unconcern"
        ],
        "example": "There is a growing apathy among voters."
      },
      {
        "word": "arid",
        "pos": "adjective",
        "phonetic": "/ˈær.ɪd/",
        "translation": "Khô cằn, vô vị",
        "synonyms": [
          "dry",
          "barren"
        ],
        "example": "The desert is an arid region."
      },
      {
        "word": "ascertain",
        "pos": "verb",
        "phonetic": "/ˌæs.əˈteɪn/",
        "translation": "Xác định, tìm hiểu chắc chắn",
        "synonyms": [
          "determine",
          "discover"
        ],
        "example": "We need to ascertain the facts before making a decision."
      },
      {
        "word": "assuage",
        "pos": "verb",
        "phonetic": "/əˈsweɪdʒ/",
        "translation": "Làm dịu bớt",
        "synonyms": [
          "relieve",
          "alleviate"
        ],
        "example": "The government has tried to assuage the public's fears."
      },
      {
        "word": "audacious",
        "pos": "adjective",
        "phonetic": "/ɔːˈdeɪ.ʃəs/",
        "translation": "Táo bạo, trơ tráo",
        "synonyms": [
          "bold",
          "daring"
        ],
        "example": "He described the plan as ambitious and audacious."
      },
      {
        "word": "austere",
        "pos": "adjective",
        "phonetic": "/ɔːˈstɪər/",
        "translation": "Khắc khổ, mộc mạc, giản dị",
        "synonyms": [
          "severe",
          "strict",
          "plain"
        ],
        "example": "The monks live an austere life."
      },
      {
        "word": "benevolent",
        "pos": "adjective",
        "phonetic": "/bəˈnev.əl.ənt/",
        "translation": "Nhân ái, từ thiện",
        "synonyms": [
          "kind",
          "generous"
        ],
        "example": "He was a benevolent old man."
      },
      {
        "word": "bolster",
        "pos": "verb",
        "phonetic": "/ˈbəʊl.stər/",
        "translation": "Ủng hộ, củng cố",
        "synonyms": [
          "support",
          "reinforce"
        ],
        "example": "More money is needed to bolster the industry."
      },
      {
        "word": "cacophony",
        "pos": "noun",
        "phonetic": "/kəˈkɒf.ə.ni/",
        "translation": "Âm thanh chói tai, hỗn tạp",
        "synonyms": [
          "noise",
          "discord"
        ],
        "example": "As we entered the farmyard we were met with a cacophony of animal sounds."
      },
      {
        "word": "capricious",
        "pos": "adjective",
        "phonetic": "/kəˈprɪʃ.əs/",
        "translation": "Thất thường, hay thay đổi",
        "synonyms": [
          "fickle",
          "unpredictable"
        ],
        "example": "He was a cruel and capricious tyrant."
      },
      {
        "word": "castigate",
        "pos": "verb",
        "phonetic": "/ˈkæs.tɪ.ɡeɪt/",
        "translation": "Trừng phạt, khiển trách nặng nề",
        "synonyms": [
          "reprimand",
          "scold"
        ],
        "example": "He was castigated by the media for his remarks."
      },
      {
        "word": "catalyst",
        "pos": "noun",
        "phonetic": "/ˈkæt.əl.ɪst/",
        "translation": "Chất xúc tác, người tạo thay đổi",
        "synonyms": [
          "stimulus",
          "spark"
        ],
        "example": "The protests became a catalyst for political change."
      },
      {
        "word": "caustic",
        "pos": "adjective",
        "phonetic": "/ˈkɔː.stɪk/",
        "translation": "Chua chát, cay độc, ăn mòn",
        "synonyms": [
          "sarcastic",
          "corrosive"
        ],
        "example": "She made a caustic remark about his clothes."
      },
      {
        "word": "clairvoyant",
        "pos": "adjective",
        "phonetic": "/kleəˈvɔɪ.ənt/",
        "translation": "Sáng suốt, có thể thấu thị",
        "synonyms": [
          "prophetic",
          "psychic"
        ],
        "example": "She claimed to be clairvoyant."
      },
      {
        "word": "coerce",
        "pos": "verb",
        "phonetic": "/kəʊˈɜːs/",
        "translation": "Ép buộc, cưỡng bức",
        "synonyms": [
          "force",
          "compel"
        ],
        "example": "The rebels coerced the villagers into hiding them."
      },
      {
        "word": "collaborate",
        "pos": "verb",
        "phonetic": "/kəˈlæb.ə.reɪt/",
        "translation": "Hợp tác",
        "synonyms": [
          "cooperate",
          "work together"
        ],
        "example": "Two writers collaborated on the script for the film."
      },
      {
        "word": "complacent",
        "pos": "adjective",
        "phonetic": "/kəmˈpleɪ.sənt/",
        "translation": "Tự mãn",
        "synonyms": [
          "smug",
          "self-satisfied"
        ],
        "example": "We cannot afford to be complacent about our health."
      },
      {
        "word": "conciliatory",
        "pos": "adjective",
        "phonetic": "/kənˈsɪl.i.ə.tər.i/",
        "translation": "Hòa giải, xoa dịu",
        "synonyms": [
          "appeasing",
          "pacifying"
        ],
        "example": "He adopted a conciliatory tone."
      },
      {
        "word": "condone",
        "pos": "verb",
        "phonetic": "/kənˈdəʊn/",
        "translation": "Bỏ qua, dung túng",
        "synonyms": [
          "pardon",
          "excuse",
          "overlook"
        ],
        "example": "I cannot condone the use of violence."
      },
      {
        "word": "conundrum",
        "pos": "noun",
        "phonetic": "/kəˈnʌn.drəm/",
        "translation": "Câu đố, vấn đề nan giải",
        "synonyms": [
          "puzzle",
          "dilemma"
        ],
        "example": "Arranging the seating for the wedding was a true conundrum."
      },
      {
        "word": "corroborate",
        "pos": "verb",
        "phonetic": "/kəˈrɒb.ə.reɪt/",
        "translation": "Xác minh, chứng thực",
        "synonyms": [
          "confirm",
          "verify"
        ],
        "example": "Recent research seems to corroborate his theory."
      },
      {
        "word": "credulous",
        "pos": "adjective",
        "phonetic": "/ˈkredʒ.ə.ləs/",
        "translation": "Cả tin, nhẹ dạ",
        "synonyms": [
          "gullible",
          "naive"
        ],
        "example": "A credulous person is easily duped."
      },
      {
        "word": "culpable",
        "pos": "adjective",
        "phonetic": "/ˈkʌl.pə.bəl/",
        "translation": "Đáng khiển trách, có tội",
        "synonyms": [
          "guilty",
          "blameworthy"
        ],
        "example": "He was held culpable for all that had happened."
      },
      {
        "word": "dearth",
        "pos": "noun",
        "phonetic": "/dɜːθ/",
        "translation": "Sự khan hiếm, thiếu hụt",
        "synonyms": [
          "lack",
          "scarcity"
        ],
        "example": "There is a dearth of reliable information on the subject."
      },
      {
        "word": "debilitate",
        "pos": "verb",
        "phonetic": "/dɪˈbɪl.ɪ.teɪt/",
        "translation": "Làm suy nhược",
        "synonyms": [
          "weaken",
          "enfeeble"
        ],
        "example": "Chemotherapy exhausted and debilitated him."
      },
      {
        "word": "delineate",
        "pos": "verb",
        "phonetic": "/dɪˈlɪn.i.eɪt/",
        "translation": "Mô tả chi tiết, phác họa",
        "synonyms": [
          "outline",
          "describe"
        ],
        "example": "The law should delineate the exact boundaries."
      },
      {
        "word": "demagogue",
        "pos": "noun",
        "phonetic": "/ˈdem.ə.ɡɒɡ/",
        "translation": "Kẻ mị dân",
        "synonyms": [
          "agitator",
          "rabble-rouser"
        ],
        "example": "The politician was a demagogue who played on prejudices."
      },
      {
        "word": "deride",
        "pos": "verb",
        "phonetic": "/dɪˈraɪd/",
        "translation": "Chế nhạo, giễu cợt",
        "synonyms": [
          "mock",
          "ridicule"
        ],
        "example": "He derided my singing as pathetic."
      },
      {
        "word": "desiccate",
        "pos": "verb",
        "phonetic": "/ˈdes.ɪ.keɪt/",
        "translation": "Làm khô kiệt, sấy khô",
        "synonyms": [
          "dry out",
          "dehydrate"
        ],
        "example": "Intense heat desiccates the soil."
      },
      {
        "word": "diatribe",
        "pos": "noun",
        "phonetic": "/ˈdaɪ.ə.traɪb/",
        "translation": "Bài đả kích kịch liệt",
        "synonyms": [
          "tirade",
          "harangue"
        ],
        "example": "He launched a bitter diatribe against the younger generation."
      },
      {
        "word": "didactic",
        "pos": "adjective",
        "phonetic": "/daɪˈdæk.tɪk/",
        "translation": "Mang tính giáo huấn, răn dạy",
        "synonyms": [
          "educational",
          "instructive"
        ],
        "example": "Children's books are often didactic."
      },
      {
        "word": "digression",
        "pos": "noun",
        "phonetic": "/daɪˈɡreʃ.ən/",
        "translation": "Sự lạc đề",
        "synonyms": [
          "deviation",
          "tangent"
        ],
        "example": "Talking about money now would be a digression from the main purpose."
      },
      {
        "word": "discredit",
        "pos": "verb",
        "phonetic": "/dɪˈskred.ɪt/",
        "translation": "Làm mất uy tín, bác bỏ",
        "synonyms": [
          "defame",
          "debunk"
        ],
        "example": "Evidence was presented to discredit her testimony."
      },
      {
        "word": "disdain",
        "pos": "noun",
        "phonetic": "/dɪsˈdeɪn/",
        "translation": "Sự khinh bỉ, coi thường",
        "synonyms": [
          "contempt",
          "scorn"
        ],
        "example": "He regards the political process with disdain."
      },
      {
        "word": "dissonance",
        "pos": "noun",
        "phonetic": "/ˈdɪs.ə.nəns/",
        "translation": "Sự bất hòa, chói tai",
        "synonyms": [
          "discord",
          "conflict"
        ],
        "example": "There is cognitive dissonance between what they say and do."
      },
      {
        "word": "dogmatic",
        "pos": "adjective",
        "phonetic": "/dɒɡˈmæt.ɪk/",
        "translation": "Giáo điều, độc đoán",
        "synonyms": [
          "rigid",
          "inflexible"
        ],
        "example": "He was highly dogmatic in his political views."
      },
      {
        "word": "ebullient",
        "pos": "adjective",
        "phonetic": "/ɪˈbʌl.i.ənt/",
        "translation": "Sôi nổi, bồng bột",
        "synonyms": [
          "enthusiastic",
          "exuberant"
        ],
        "example": "He was incredibly ebullient after the victory."
      },
      {
        "word": "eclectic",
        "pos": "adjective",
        "phonetic": "/ɪˈklek.tɪk/",
        "translation": "Lựa chọn từ nhiều nguồn, pha trộn",
        "synonyms": [
          "diverse",
          "varied"
        ],
        "example": "His taste in music is incredibly eclectic."
      },
      {
        "word": "efficacy",
        "pos": "noun",
        "phonetic": "/ˈef.ɪ.kə.si/",
        "translation": "Tính hiệu quả",
        "synonyms": [
          "effectiveness",
          "success"
        ],
        "example": "They recently ran a series of tests to measure the efficacy of the drug."
      },
      {
        "word": "elucidate",
        "pos": "verb",
        "phonetic": "/iˈluː.sɪ.deɪt/",
        "translation": "Làm sáng tỏ, giải thích rõ",
        "synonyms": [
          "clarify",
          "explain"
        ],
        "example": "I don't understand. You'll have to elucidate."
      },
      {
        "word": "emulate",
        "pos": "verb",
        "phonetic": "/ˈem.jə.leɪt/",
        "translation": "Bắt chước, ganh đua",
        "synonyms": [
          "imitate",
          "copy"
        ],
        "example": "They hope to emulate the success of other software companies."
      },
      {
        "word": "enervate",
        "pos": "verb",
        "phonetic": "/ˈen.ə.veɪt/",
        "translation": "Làm suy yếu, làm mất sức",
        "synonyms": [
          "exhaust",
          "weaken"
        ],
        "example": "The hot sun enervated her to the point of collapse."
      },
      {
        "word": "engender",
        "pos": "verb",
        "phonetic": "/ɪnˈdʒen.dər/",
        "translation": "Sinh ra, đem lại",
        "synonyms": [
          "produce",
          "cause"
        ],
        "example": "Her latest book has engendered a lot of controversy."
      },
      {
        "word": "enigma",
        "pos": "noun",
        "phonetic": "/ɪˈnɪɡ.mə/",
        "translation": "Điều bí ẩn",
        "synonyms": [
          "mystery",
          "puzzle"
        ],
        "example": "The origin of the universe remains an enigma."
      },
      {
        "word": "ephemeral",
        "pos": "adjective",
        "phonetic": "/ɪˈfem.ər.əl/",
        "translation": "Phù du, chóng tàn",
        "synonyms": [
          "fleeting",
          "short-lived"
        ],
        "example": "Fame in the world of pop music is largely ephemeral."
      },
      {
        "word": "equivocate",
        "pos": "verb",
        "phonetic": "/ɪˈkwɪv.ə.keɪt/",
        "translation": "Nói mập mờ, nói nước đôi",
        "synonyms": [
          "prevaricate",
          "dodge"
        ],
        "example": "She equivocated when asked about her future plans."
      },
      {
        "word": "erudite",
        "pos": "adjective",
        "phonetic": "/ˈer.ʊ.daɪt/",
        "translation": "Uyên bác, thông thái",
        "synonyms": [
          "learned",
          "scholarly"
        ],
        "example": "He is an erudite scholar of early history."
      },
      {
        "word": "esoteric",
        "pos": "adjective",
        "phonetic": "/ˌes.əˈter.ɪk/",
        "translation": "Thâm thúy, bí truyền",
        "synonyms": [
          "obscure",
          "arcane"
        ],
        "example": "He has an esoteric collection of old toys and games."
      },
      {
        "word": "eulogy",
        "pos": "noun",
        "phonetic": "/ˈjuː.lə.dʒi/",
        "translation": "Bài tán dương, điếu văn",
        "synonyms": [
          "tribute",
          "praise"
        ],
        "example": "The song was a eulogy to the joys of travelling."
      },
      {
        "word": "evanescent",
        "pos": "adjective",
        "phonetic": "/ˌev.əˈnes.ənt/",
        "translation": "Mau phai mờ, phù du",
        "synonyms": [
          "vanishing",
          "fleeting"
        ],
        "example": "A shimmering, evanescent bubble."
      },
      {
        "word": "exacerbate",
        "pos": "verb",
        "phonetic": "/ɪɡˈzæs.ə.beɪt/",
        "translation": "Làm trầm trọng thêm",
        "synonyms": [
          "worsen",
          "aggravate"
        ],
        "example": "His aggressive reaction only exacerbated the situation."
      },
      {
        "word": "exonerate",
        "pos": "verb",
        "phonetic": "/ɪɡˈzɒn.ə.reɪt/",
        "translation": "Giải trừ hình phạt, miễn tội",
        "synonyms": [
          "acquit",
          "absolve"
        ],
        "example": "The report exonerated the crew from all responsibility."
      },
      {
        "word": "extraneous",
        "pos": "adjective",
        "phonetic": "/ɪkˈstreɪ.ni.əs/",
        "translation": "Không liên quan, ngoài lề",
        "synonyms": [
          "irrelevant",
          "unrelated"
        ],
        "example": "These questions are extraneous to the issue."
      },
      {
        "word": "facetious",
        "pos": "adjective",
        "phonetic": "/fəˈsiː.ʃəs/",
        "translation": "Đùa cợt không đúng lúc",
        "synonyms": [
          "flippant",
          "humorous"
        ],
        "example": "He kept making facetious remarks during the meeting."
      },
      {
        "word": "fastidious",
        "pos": "adjective",
        "phonetic": "/fæsˈtɪd.i.əs/",
        "translation": "Khó tính, kén cá chọn canh",
        "synonyms": [
          "meticulous",
          "picky"
        ],
        "example": "He is very fastidious about how a suitcase should be packed."
      },
      {
        "word": "fervent",
        "pos": "adjective",
        "phonetic": "/ˈfɜː.vənt/",
        "translation": "Nhiệt thành, nồng nhiệt",
        "synonyms": [
          "passionate",
          "ardent"
        ],
        "example": "It is his fervent hope that a peaceful solution will soon be found."
      },
      {
        "word": "frugal",
        "pos": "adjective",
        "phonetic": "/ˈfruː.ɡəl/",
        "translation": "Tiết kiệm, thanh đạm",
        "synonyms": [
          "thrifty",
          "economical"
        ],
        "example": "He built up his savings by being very frugal."
      },
      {
        "word": "garrulous",
        "pos": "adjective",
        "phonetic": "/ˈɡær.əl.əs/",
        "translation": "Lắm lời, ba hoa",
        "synonyms": [
          "talkative",
          "loquacious"
        ],
        "example": "I had a very garrulous neighbor."
      },
      {
        "word": "gregarious",
        "pos": "adjective",
        "phonetic": "/ɡrɪˈɡeə.ri.əs/",
        "translation": "Thích giao du, sống thành bầy",
        "synonyms": [
          "sociable",
          "outgoing"
        ],
        "example": "Emma is a gregarious, outgoing person."
      },
      {
        "word": "hackneyed",
        "pos": "adjective",
        "phonetic": "/ˈhæk.nid/",
        "translation": "Nhàm chán, sáo rỗng",
        "synonyms": [
          "clichéd",
          "overused"
        ],
        "example": "The plot of the film is just a hackneyed boy-meets-girl scenario."
      },
      {
        "word": "halcyon",
        "pos": "adjective",
        "phonetic": "/ˈhæl.si.ən/",
        "translation": "Thanh bình, êm ả",
        "synonyms": [
          "peaceful",
          "tranquil"
        ],
        "example": "She recalled the halcyon days of her youth."
      },
      {
        "word": "haughty",
        "pos": "adjective",
        "phonetic": "/ˈhɔː.ti/",
        "translation": "Kiêu kỳ, ngạo mạn",
        "synonyms": [
          "arrogant",
          "snobbish"
        ],
        "example": "She has a rather haughty manner."
      },
      {
        "word": "hedonism",
        "pos": "noun",
        "phonetic": "/ˈhiː.dən.ɪ.zəm/",
        "translation": "Chủ nghĩa khoái lạc",
        "synonyms": [
          "indulgence",
          "pleasure-seeking"
        ],
        "example": "His novel is a celebration of hedonism."
      },
      {
        "word": "iconoclast",
        "pos": "noun",
        "phonetic": "/aɪˈkɒn.ə.klæst/",
        "translation": "Người bài trừ thần tượng/truyền thống",
        "synonyms": [
          "rebel",
          "nonconformist"
        ],
        "example": "He was an iconoclast who challenged everything."
      },
      {
        "word": "idiosyncrasy",
        "pos": "noun",
        "phonetic": "/ˌɪd.i.əˈsɪŋ.krə.si/",
        "translation": "Khí chất riêng, đặc tính kỳ dị",
        "synonyms": [
          "peculiarity",
          "quirk"
        ],
        "example": "She often cracks her knuckles, which is one of her little idiosyncrasies."
      },
      {
        "word": "impetuous",
        "pos": "adjective",
        "phonetic": "/ɪmˈpetʃ.u.əs/",
        "translation": "Hấp tấp, bốc đồng",
        "synonyms": [
          "impulsive",
          "rash"
        ],
        "example": "He's so impetuous - why can't he think things over before he acts?"
      },
      {
        "word": "implacable",
        "pos": "adjective",
        "phonetic": "/ɪmˈplæk.ə.bəl/",
        "translation": "Không thể xoa dịu, thù dai",
        "synonyms": [
          "unforgiving",
          "relentless"
        ],
        "example": "The government faces implacable opposition."
      },
      {
        "word": "inane",
        "pos": "adjective",
        "phonetic": "/ɪˈneɪn/",
        "translation": "Ngớ ngẩn, vô nghĩa",
        "synonyms": [
          "silly",
          "foolish"
        ],
        "example": "There are too many inane quiz shows on television."
      },
      {
        "word": "inchoate",
        "pos": "adjective",
        "phonetic": "/ɪnˈkəʊ.eɪt/",
        "translation": "Mới bắt đầu, chưa phát triển đầy đủ",
        "synonyms": [
          "undeveloped",
          "rudimentary"
        ],
        "example": "She had a child's inchoate awareness of language."
      },
      {
        "word": "inconsequential",
        "pos": "adjective",
        "phonetic": "/ɪnˌkɒn.sɪˈkwen.ʃəl/",
        "translation": "Không quan trọng, vụn vặt",
        "synonyms": [
          "unimportant",
          "trivial"
        ],
        "example": "Most of what she said was pretty inconsequential."
      },
      {
        "word": "incorrigible",
        "pos": "adjective",
        "phonetic": "/ɪnˈkɒr.ə.dʒə.bəl/",
        "translation": "Không thể sửa đổi thói hư",
        "synonyms": [
          "inveterate",
          "habitual"
        ],
        "example": "He is an incorrigible liar."
      },
      {
        "word": "indolent",
        "pos": "adjective",
        "phonetic": "/ˈɪn.dəl.ənt/",
        "translation": "Lười biếng",
        "synonyms": [
          "lazy",
          "lethargic"
        ],
        "example": "He is an indolent teenager who refuses to help out."
      },
      {
        "word": "ineffable",
        "pos": "adjective",
        "phonetic": "/ɪˈnef.ə.bəl/",
        "translation": "Không thể diễn tả bằng lời",
        "synonyms": [
          "indescribable",
          "beyond words"
        ],
        "example": "The beauty of the sunset was ineffable."
      },
      {
        "word": "inexorable",
        "pos": "adjective",
        "phonetic": "/ɪˈneks.ər.ə.bəl/",
        "translation": "Không thể lay chuyển, tàn nhẫn",
        "synonyms": [
          "unstoppable",
          "relentless"
        ],
        "example": "The inexorable progress of science cannot be stopped."
      },
      {
        "word": "inimical",
        "pos": "adjective",
        "phonetic": "/ɪˈnɪm.ɪ.kəl/",
        "translation": "Có hại, thù địch",
        "synonyms": [
          "hostile",
          "harmful"
        ],
        "example": "Excessive control is inimical to creative expression."
      },
      {
        "word": "innocuous",
        "pos": "adjective",
        "phonetic": "/ɪˈnɒk.ju.əs/",
        "translation": "Vô hại",
        "synonyms": [
          "harmless",
          "safe"
        ],
        "example": "Some mushrooms look innocuous but are in fact poisonous."
      },
      {
        "word": "insidious",
        "pos": "adjective",
        "phonetic": "/ɪnˈsɪd.i.əs/",
        "translation": "Xảo quyệt, ngấm ngầm gây hại",
        "synonyms": [
          "stealthy",
          "subtle"
        ],
        "example": "High blood pressure is an insidious disease."
      },
      {
        "word": "intransigent",
        "pos": "adjective",
        "phonetic": "/ɪnˈtræn.zɪ.dʒənt/",
        "translation": "Không khoan nhượng, cố chấp",
        "synonyms": [
          "stubborn",
          "uncompromising"
        ],
        "example": "Unions claim that the management continues to maintain an intransigent position."
      },
      {
        "word": "intrepid",
        "pos": "adjective",
        "phonetic": "/ɪnˈtrep.ɪd/",
        "translation": "Gan dạ, dũng cảm",
        "synonyms": [
          "fearless",
          "brave"
        ],
        "example": "Our intrepid reporter went to the war zone."
      },
      {
        "word": "juxtapose",
        "pos": "verb",
        "phonetic": "/ˌdʒʌk.stəˈpəʊz/",
        "translation": "Đặt cạnh nhau để đối chiếu",
        "synonyms": [
          "compare",
          "contrast"
        ],
        "example": "The exhibition juxtaposes Picasso's early drawings with his later works."
      },
      {
        "word": "laconic",
        "pos": "adjective",
        "phonetic": "/ləˈkɒn.ɪk/",
        "translation": "Vắn tắt, súc tích",
        "synonyms": [
          "concise",
          "brief"
        ],
        "example": "She had a laconic wit."
      },
      {
        "word": "languid",
        "pos": "adjective",
        "phonetic": "/ˈlæŋ.ɡwɪd/",
        "translation": "Uể oải, lờ đờ",
        "synonyms": [
          "sluggish",
          "relaxed"
        ],
        "example": "He sat on the porch, enjoying the languid summer afternoon."
      },
      {
        "word": "latent",
        "pos": "adjective",
        "phonetic": "/ˈleɪ.tənt/",
        "translation": "Tiềm ẩn",
        "synonyms": [
          "hidden",
          "dormant"
        ],
        "example": "We're trying to bring out the latent artistic talents that many people possess."
      },
      {
        "word": "laudatory",
        "pos": "adjective",
        "phonetic": "/ˈlɔː.də.tər.i/",
        "translation": "Tán dương, ca ngợi",
        "synonyms": [
          "praising",
          "complimentary"
        ],
        "example": "The play received laudatory reviews."
      },
      {
        "word": "lethargic",
        "pos": "adjective",
        "phonetic": "/ləˈθɑː.dʒɪk/",
        "translation": "Uể oải, hôn mê",
        "synonyms": [
          "sluggish",
          "inactive"
        ],
        "example": "I was feeling tired and lethargic."
      },
      {
        "word": "loquacious",
        "pos": "adjective",
        "phonetic": "/ləˈkweɪ.ʃəs/",
        "translation": "Nói nhiều, ba hoa",
        "synonyms": [
          "talkative",
          "garrulous"
        ],
        "example": "She was a loquacious and friendly young woman."
      },
      {
        "word": "lucid",
        "pos": "adjective",
        "phonetic": "/ˈluː.sɪd/",
        "translation": "Sáng sủa, minh mẫn, dễ hiểu",
        "synonyms": [
          "clear",
          "coherent"
        ],
        "example": "She gave a clear and lucid account of her plans."
      },
      {
        "word": "magnanimous",
        "pos": "adjective",
        "phonetic": "/mæɡˈnæn.ɪ.məs/",
        "translation": "Hào hiệp, cao thượng",
        "synonyms": [
          "generous",
          "noble"
        ],
        "example": "The team's manager was magnanimous in victory."
      },
      {
        "word": "malleable",
        "pos": "adjective",
        "phonetic": "/ˈmæl.i.ə.bəl/",
        "translation": "Dễ uốn nắn, dễ sai bảo",
        "synonyms": [
          "pliable",
          "flexible"
        ],
        "example": "Lead and tin are malleable metals."
      },
      {
        "word": "meticulous",
        "pos": "adjective",
        "phonetic": "/məˈtɪk.jə.ləs/",
        "translation": "Tỉ mỉ, quá kỹ càng",
        "synonyms": [
          "careful",
          "thorough"
        ],
        "example": "Many hours of meticulous preparation have gone into writing the book."
      },
      {
        "word": "misanthrope",
        "pos": "noun",
        "phonetic": "/ˈmɪz.ən.θrəʊp/",
        "translation": "Người ghét nhân loại",
        "synonyms": [
          "cynic",
          "hater"
        ],
        "example": "The old man was a misanthrope who lived alone."
      },
      {
        "word": "mitigate",
        "pos": "verb",
        "phonetic": "/ˈmɪt.ɪ.ɡeɪt/",
        "translation": "Làm nhẹ bớt, giảm nhẹ",
        "synonyms": [
          "alleviate",
          "ease"
        ],
        "example": "It is unclear how to mitigate the effects of tourism on the island."
      },
      {
        "word": "mollify",
        "pos": "verb",
        "phonetic": "/ˈmɒl.ɪ.faɪ/",
        "translation": "Làm nguôi giận, xoa dịu",
        "synonyms": [
          "pacify",
          "appease"
        ],
        "example": "I tried to mollify her by giving her flowers."
      },
      {
        "word": "morose",
        "pos": "adjective",
        "phonetic": "/məˈrəʊs/",
        "translation": "Buồn rầu, ủ rũ",
        "synonyms": [
          "sullen",
          "gloomy"
        ],
        "example": "Why are you so morose these days?"
      },
      {
        "word": "mundane",
        "pos": "adjective",
        "phonetic": "/mʌnˈdeɪn/",
        "translation": "Trần tục, bình thường, tẻ nhạt",
        "synonyms": [
          "ordinary",
          "routine"
        ],
        "example": "Mundane matters such as paying bills and shopping for food do not interest her."
      },
      {
        "word": "nefarious",
        "pos": "adjective",
        "phonetic": "/nɪˈfeə.ri.əs/",
        "translation": "Xấu xa, độc ác",
        "synonyms": [
          "wicked",
          "evil"
        ],
        "example": "They hackers are notorious for their nefarious activities."
      },
      {
        "word": "nonchalant",
        "pos": "adjective",
        "phonetic": "/ˈnɒn.ʃəl.ənt/",
        "translation": "Thờ ơ, lãnh đạm",
        "synonyms": [
          "casual",
          "unconcerned"
        ],
        "example": "She had a nonchalant way of walking into a room."
      },
      {
        "word": "nuance",
        "pos": "noun",
        "phonetic": "/ˈnjuː.ɑːns/",
        "translation": "Sắc thái nhỏ",
        "synonyms": [
          "subtlety",
          "distinction"
        ],
        "example": "Linguists explore the nuances of language."
      },
      {
        "word": "obdurate",
        "pos": "adjective",
        "phonetic": "/ˈɒb.dʒə.rət/",
        "translation": "Ngoan cố, cứng đầu",
        "synonyms": [
          "stubborn",
          "obstinate"
        ],
        "example": "The president remains obdurate on immigration."
      },
      {
        "word": "obfuscate",
        "pos": "verb",
        "phonetic": "/ˈɒb.fʌs.keɪt/",
        "translation": "Làm mờ mịt, làm rối rắm",
        "synonyms": [
          "confuse",
          "obscure"
        ],
        "example": "She was criticized for using arguments that obfuscated the main issue."
      },
      {
        "word": "obsequious",
        "pos": "adjective",
        "phonetic": "/əbˈsiː.kwi.əs/",
        "translation": "Khúm núm, xun xoe",
        "synonyms": [
          "fawning",
          "servile"
        ],
        "example": "She is almost embarrassingly obsequious to anyone in authority."
      },
      {
        "word": "obstinate",
        "pos": "adjective",
        "phonetic": "/ˈɒb.stɪ.nət/",
        "translation": "Bướng bỉnh, ngoan cố",
        "synonyms": [
          "stubborn",
          "inflexible"
        ],
        "example": "He can be very obstinate at times."
      },
      {
        "word": "obviate",
        "pos": "verb",
        "phonetic": "/ˈɒb.vi.eɪt/",
        "translation": "Loại bỏ, tránh được khó khăn",
        "synonyms": [
          "prevent",
          "preclude"
        ],
        "example": "A peaceful solution would obviate the need for military intervention."
      },
      {
        "word": "opaque",
        "pos": "adjective",
        "phonetic": "/əʊˈpeɪk/",
        "translation": "Mờ đục, khó hiểu",
        "synonyms": [
          "unclear",
          "obscure"
        ],
        "example": "I find her poetry a little too opaque."
      },
      {
        "word": "opprobrium",
        "pos": "noun",
        "phonetic": "/əˈprəʊ.bri.əm/",
        "translation": "Sự sỉ nhục, nhục nhã công khai",
        "synonyms": [
          "disgrace",
          "infamy"
        ],
        "example": "His controversial remarks drew international opprobrium."
      },
      {
        "word": "ostentatious",
        "pos": "adjective",
        "phonetic": "/ˌɒs.tenˈteɪ.ʃəs/",
        "translation": "Phô trương, khoe khoang",
        "synonyms": [
          "showy",
          "pretentious"
        ],
        "example": "They criticized the ostentatious lifestyle of the rich."
      },
      {
        "word": "paradigm",
        "pos": "noun",
        "phonetic": "/ˈpær.ə.daɪm/",
        "translation": "Mô hình, hệ chuẩn",
        "synonyms": [
          "model",
          "example"
        ],
        "example": "His ruthless accumulation of wealth stands as a paradigm of greed."
      },
      {
        "word": "pedant",
        "pos": "noun",
        "phonetic": "/ˈped.ənt/",
        "translation": "Người chuộng hình thức, hay bắt bẻ",
        "synonyms": [
          "perfectionist",
          "formalist"
        ],
        "example": "The grammar pedant pointed out every tiny error in my essay."
      },
      {
        "word": "perfunctory",
        "pos": "adjective",
        "phonetic": "/pəˈfʌŋk.tər.i/",
        "translation": "Làm cho có lệ, đại khái",
        "synonyms": [
          "cursory",
          "superficial"
        ],
        "example": "His smile was merely perfunctory."
      },
      {
        "word": "pernicious",
        "pos": "adjective",
        "phonetic": "/pəˈnɪʃ.əs/",
        "translation": "Độc hại, nguy hiểm ngầm",
        "synonyms": [
          "harmful",
          "destructive"
        ],
        "example": "The cuts in government funding have had a pernicious effect on local services."
      },
      {
        "word": "philanthropist",
        "pos": "noun",
        "phonetic": "/fɪˈlæn.θrə.pɪst/",
        "translation": "Nhà từ thiện",
        "synonyms": [
          "benefactor",
          "donor"
        ],
        "example": "She is a well-known philanthropist who donates millions."
      },
      {
        "word": "placate",
        "pos": "verb",
        "phonetic": "/pləˈkeɪt/",
        "translation": "Xoa dịu ai đó",
        "synonyms": [
          "appease",
          "pacify"
        ],
        "example": "She did more than merely placate him; she genuinely helped."
      },
      {
        "word": "polemic",
        "pos": "noun",
        "phonetic": "/pəˈlem.ɪk/",
        "translation": "Cuộc luận chiến, bài đả kích",
        "synonyms": [
          "tirade",
          "diatribe"
        ],
        "example": "She has published a fierce anti-war polemic."
      },
      {
        "word": "pragmatic",
        "pos": "adjective",
        "phonetic": "/præɡˈmæt.ɪk/",
        "translation": "Thực tế, thực dụng",
        "synonyms": [
          "practical",
          "realistic"
        ],
        "example": "In business, the pragmatic approach to problems is often more successful."
      },
      {
        "word": "precipitate",
        "pos": "verb / noun",
        "phonetic": "/prɪˈsɪp.ɪ.teɪt/",
        "translation": "Làm đẩy nhanh, Hấp tấp (adj)",
        "synonyms": [
          "hasten",
          "trigger"
        ],
        "example": "An invasion would certainly precipitate a political crisis."
      },
      {
        "word": "precocious",
        "pos": "adjective",
        "phonetic": "/prɪˈkəʊ.ʃəs/",
        "translation": "Phát triển sớm trí tuệ",
        "synonyms": [
          "advanced",
          "gifted"
        ],
        "example": "A precocious child, she went to university at the age of 14."
      },
      {
        "word": "pretentious",
        "pos": "adjective",
        "phonetic": "/prɪˈten.ʃəs/",
        "translation": "Tự phụ, kiêu căng",
        "synonyms": [
          "snobbish",
          "conceited"
        ],
        "example": "The novel deals with grand themes, but is never pretentious."
      },
      {
        "word": "prolific",
        "pos": "adjective",
        "phonetic": "/prəˈlɪf.ɪk/",
        "translation": "Sinh sản nhiều, sáng tác nhiều",
        "synonyms": [
          "productive",
          "abundant"
        ],
        "example": "He was probably the most prolific songwriter of his generation."
      },
      {
        "word": "propriety",
        "pos": "noun",
        "phonetic": "/prəˈpraɪə.ti/",
        "translation": "Sự đúng đắn, phép tắc",
        "synonyms": [
          "decorum",
          "respectability"
        ],
        "example": "The director insisted that there was no question as to the propriety of how the funds were spent."
      },
      {
        "word": "prosaic",
        "pos": "adjective",
        "phonetic": "/prəˈzeɪ.ɪk/",
        "translation": "Tầm thường, thiếu lãng mạn",
        "synonyms": [
          "ordinary",
          "mundane"
        ],
        "example": "If only she'd been called Camilla or Flavia instead of the prosaic Jane."
      },
      {
        "word": "prudent",
        "pos": "adjective",
        "phonetic": "/ˈpruː.dənt/",
        "translation": "Thận trọng, khôn ngoan",
        "synonyms": [
          "wise",
          "cautious"
        ],
        "example": "It's always prudent to read a contract carefully before signing it."
      },
      {
        "word": "pugnacious",
        "pos": "adjective",
        "phonetic": "/pʌɡˈneɪ.ʃəs/",
        "translation": "Hay cãi lộn, thích đánh nhau",
        "synonyms": [
          "combative",
          "aggressive"
        ],
        "example": "I found him pugnacious and arrogant."
      },
      {
        "word": "querulous",
        "pos": "adjective",
        "phonetic": "/ˈkwer.jə.ləs/",
        "translation": "Hay càu nhàu, than phiền",
        "synonyms": [
          "complaining",
          "petulant"
        ],
        "example": "He became increasingly dissatisfied and querulous in his old age."
      },
      {
        "word": "quixotic",
        "pos": "adjective",
        "phonetic": "/kwɪkˈsɒt.ɪk/",
        "translation": "Hão huyền, lãng mạn mù quáng",
        "synonyms": [
          "idealistic",
          "impractical"
        ],
        "example": "This is a vast, exciting and some say quixotic project."
      },
      {
        "word": "rancor",
        "pos": "noun",
        "phonetic": "/ˈræŋ.kər/",
        "translation": "Sự thù oán, ác ý",
        "synonyms": [
          "bitterness",
          "resentment"
        ],
        "example": "They cheated me, but I feel no rancor toward them."
      },
      {
        "word": "rebuttal",
        "pos": "noun",
        "phonetic": "/rɪˈbʌt.əl/",
        "translation": "Sự bác bỏ bằng lý lẽ",
        "synonyms": [
          "refutation",
          "denial"
        ],
        "example": "She issued a point-by-point rebuttal of the company's accusations."
      },
      {
        "word": "reclusive",
        "pos": "adjective",
        "phonetic": "/rɪˈkluː.sɪv/",
        "translation": "Ẩn dật, xa lánh xã hội",
        "synonyms": [
          "isolated",
          "solitary"
        ],
        "example": "She became increasingly reclusive after the tragedy."
      },
      {
        "word": "recondite",
        "pos": "adjective",
        "phonetic": "/ˈrek.ən.daɪt/",
        "translation": "Khó hiểu, uyên thâm",
        "synonyms": [
          "obscure",
          "abstruse"
        ],
        "example": "We had to work from material that was both complex and recondite."
      },
      {
        "word": "repudiate",
        "pos": "verb",
        "phonetic": "/rɪˈpjuː.di.eɪt/",
        "translation": "Từ chối, cự tuyệt",
        "synonyms": [
          "reject",
          "deny"
        ],
        "example": "He repudiated the allegation that he had tried to deceive them."
      },
      {
        "word": "resilient",
        "pos": "adjective",
        "phonetic": "/rɪˈzɪl.i.ənt/",
        "translation": "Kiên cường, mau phục hồi",
        "synonyms": [
          "tough",
          "adaptable"
        ],
        "example": "She's a resilient girl - she won't be unhappy for long."
      },
      {
        "word": "reticent",
        "pos": "adjective",
        "phonetic": "/ˈret.ɪ.sənt/",
        "translation": "Kín đáo, dè dặt",
        "synonyms": [
          "reserved",
          "silent"
        ],
        "example": "He is very reticent about his past."
      },
      {
        "word": "rhetoric",
        "pos": "noun",
        "phonetic": "/ˈret.ər.ɪk/",
        "translation": "Thuật hùng biện, lời lẽ rỗng tuếch",
        "synonyms": [
          "oratory",
          "eloquence"
        ],
        "example": "How far the president will be able to translate his campaign rhetoric into action remains to be seen."
      },
      {
        "word": "sagacious",
        "pos": "adjective",
        "phonetic": "/səˈɡeɪ.ʃəs/",
        "translation": "Khôn ngoan, sắc sảo",
        "synonyms": [
          "wise",
          "astute"
        ],
        "example": "They were sagacious enough to avoid any outright confrontation."
      },
      {
        "word": "salient",
        "pos": "adjective",
        "phonetic": "/ˈseɪ.li.ənt/",
        "translation": "Nổi bật, quan trọng nhất",
        "synonyms": [
          "prominent",
          "notable"
        ],
        "example": "She began to summarize the salient features/points of the proposal."
      },
      {
        "word": "sanction",
        "pos": "noun / verb",
        "phonetic": "/ˈsæŋk.ʃən/",
        "translation": "Sự phê chuẩn, lệnh cấm vận",
        "synonyms": [
          "approval",
          "penalty"
        ],
        "example": "They tried to get official sanction for the scheme."
      },
      {
        "word": "scrupulous",
        "pos": "adjective",
        "phonetic": "/ˈskruː.pjə.ləs/",
        "translation": "Tỉ mỉ, có tính tự trọng cao",
        "synonyms": [
          "meticulous",
          "honest"
        ],
        "example": "A scrupulous politician would not lie."
      },
      {
        "word": "soporific",
        "pos": "adjective",
        "phonetic": "/ˌsɒp.ərˈɪf.ɪk/",
        "translation": "Gây buồn ngủ",
        "synonyms": [
          "sleep-inducing",
          "calming"
        ],
        "example": "The soporific effect of the heat."
      },
      {
        "word": "specious",
        "pos": "adjective",
        "phonetic": "/ˈspiː.ʃəs/",
        "translation": "Có vẻ đúng nhưng thực ra sai",
        "synonyms": [
          "misleading",
          "deceptive"
        ],
        "example": "His argument is completely specious."
      },
      {
        "word": "sporadic",
        "pos": "adjective",
        "phonetic": "/spəˈræd.ɪk/",
        "translation": "Lác đác, lẻ tẻ",
        "synonyms": [
          "occasional",
          "irregular"
        ],
        "example": "There have been sporadic reports of violence in the area."
      },
      {
        "word": "spurious",
        "pos": "adjective",
        "phonetic": "/ˈspjʊə.ri.əs/",
        "translation": "Giả mạo, ngụy tạo",
        "synonyms": [
          "fake",
          "false"
        ],
        "example": "Some of the arguments in favour of shutting the factory are questionable and others downright spurious."
      },
      {
        "word": "stoic",
        "pos": "adjective",
        "phonetic": "/ˈstəʊ.ɪk/",
        "translation": "Chịu đựng không bộc lộ cảm xúc",
        "synonyms": [
          "enduring",
          "impassive"
        ],
        "example": "We knew she must be in pain, despite her stoic attitude."
      },
      {
        "word": "substantiate",
        "pos": "verb",
        "phonetic": "/səbˈstæn.ʃi.eɪt/",
        "translation": "Chứng minh, xác minh",
        "synonyms": [
          "verify",
          "prove"
        ],
        "example": "We have evidence to substantiate the allegations against him."
      },
      {
        "word": "superfluous",
        "pos": "adjective",
        "phonetic": "/suːˈpɜː.flu.əs/",
        "translation": "Dư thừa, không cần thiết",
        "synonyms": [
          "extra",
          "unnecessary"
        ],
        "example": "The report was marred by a mass of superfluous detail."
      },
      {
        "word": "supplant",
        "pos": "verb",
        "phonetic": "/səˈplɑːnt/",
        "translation": "Thay thế chiếm chỗ",
        "synonyms": [
          "replace",
          "supersede"
        ],
        "example": "Printed books will soon be supplanted by e-books."
      },
      {
        "word": "surreptitious",
        "pos": "adjective",
        "phonetic": "/ˌsʌr.əpˈtɪʃ.əs/",
        "translation": "Lén lút, vụng trộm",
        "synonyms": [
          "secret",
          "stealthy"
        ],
        "example": "She seemed to be listening to what I was saying, but I saw her cast a surreptitious glance at her watch."
      },
      {
        "word": "sycophant",
        "pos": "noun",
        "phonetic": "/ˈsɪk.ə.fænt/",
        "translation": "Kẻ nịnh hót",
        "synonyms": [
          "flatterer",
          "toady"
        ],
        "example": "The prime minister is surrounded by sycophants."
      },
      {
        "word": "taciturn",
        "pos": "adjective",
        "phonetic": "/ˈtæs.ɪ.tɜːn/",
        "translation": "Ít nói, lầm lì",
        "synonyms": [
          "silent",
          "uncommunicative"
        ],
        "example": "He's a reserved, taciturn person."
      },
      {
        "word": "tenacious",
        "pos": "adjective",
        "phonetic": "/təˈneɪ.ʃəs/",
        "translation": "Bám chặt, kiên trì",
        "synonyms": [
          "persistent",
          "stubborn"
        ],
        "example": "There has been tenacious local opposition to the new airport."
      },
      {
        "word": "timorous",
        "pos": "adjective",
        "phonetic": "/ˈtɪm.ər.əs/",
        "translation": "Rụt rè, nhút nhát",
        "synonyms": [
          "fearful",
          "timid"
        ],
        "example": "He is a timorous person who is afraid of everything."
      },
      {
        "word": "transient",
        "pos": "adjective",
        "phonetic": "/ˈtræn.zi.ənt/",
        "translation": "Tạm thời, thoáng qua",
        "synonyms": [
          "fleeting",
          "temporary"
        ],
        "example": "A glass of whisky has only a transient warming effect."
      },
      {
        "word": "trepidation",
        "pos": "noun",
        "phonetic": "/ˌtrep.ɪˈdeɪ.ʃən/",
        "translation": "Sự lo lắng, bồn chồn",
        "synonyms": [
          "fear",
          "apprehension"
        ],
        "example": "We view future developments with some trepidation."
      },
      {
        "word": "ubiquitous",
        "pos": "adjective",
        "phonetic": "/juːˈbɪk.wɪ.təs/",
        "translation": "Có mặt ở khắp mọi nơi",
        "synonyms": [
          "omnipresent",
          "universal"
        ],
        "example": "Leather is very much in fashion this season, as is the ubiquitous denim."
      },
      {
        "word": "vacillate",
        "pos": "verb",
        "phonetic": "/ˈvæs.ɪ.leɪt/",
        "translation": "Dao động, phân vân",
        "synonyms": [
          "waver",
          "hesitate"
        ],
        "example": "Her mood vacillated between hope and despair."
      },
      {
        "word": "venerate",
        "pos": "verb",
        "phonetic": "/ˈven.ər.eɪt/",
        "translation": "Tôn kính, sùng bái",
        "synonyms": [
          "revere",
          "worship"
        ],
        "example": "Nelson Mandela is venerated as a hero."
      },
      {
        "word": "veracity",
        "pos": "noun",
        "phonetic": "/vəˈræs.ə.ti/",
        "translation": "Tính chân thực, sự thật",
        "synonyms": [
          "truthfulness",
          "accuracy"
        ],
        "example": "They questioned the veracity of her story."
      },
      {
        "word": "verbose",
        "pos": "adjective",
        "phonetic": "/vɜːˈbəʊs/",
        "translation": "Dài dòng, rườm rà",
        "synonyms": [
          "wordy",
          "loquacious"
        ],
        "example": "He was a notoriously verbose after-dinner speaker."
      },
      {
        "word": "vindicate",
        "pos": "verb",
        "phonetic": "/ˈvɪn.dɪ.keɪt/",
        "translation": "Minh oan, chứng minh là đúng",
        "synonyms": [
          "justify",
          "clear"
        ],
        "example": "The decision to include Morris in the team was completely vindicated when he scored two goals."
      },
      {
        "word": "vociferous",
        "pos": "adjective",
        "phonetic": "/vəˈsɪf.ər.əs/",
        "translation": "Ồn ào, to tiếng khi đòi hỏi",
        "synonyms": [
          "vocal",
          "outspoken"
        ],
        "example": "Local activist groups have become increasingly vociferous."
      },
      {
        "word": "volatile",
        "pos": "adjective",
        "phonetic": "/ˈvɒl.ə.taɪl/",
        "translation": "Dễ bay hơi, dễ biến đổi, thất thường",
        "synonyms": [
          "unstable",
          "explosive"
        ],
        "example": "Food and fuel prices are very volatile in a war situation."
      },
      {
        "word": "waver",
        "pos": "verb",
        "phonetic": "/ˈweɪ.vər/",
        "translation": "Dao động, chần chừ",
        "synonyms": [
          "hesitate",
          "fluctuate"
        ],
        "example": "I'm afraid my concentration began to waver as lunch approached."
      },
      {
        "word": "zealous",
        "pos": "adjective",
        "phonetic": "/ˈzel.əs/",
        "translation": "Nhiệt huyết, hăng hái",
        "synonyms": [
          "fervent",
          "passionate"
        ],
        "example": "No one was more zealous than Neil in supporting the proposal."
      },
      {
        "word": "abstruse",
        "pos": "adjective",
        "phonetic": "/əbˈstruːs/",
        "translation": "Khó hiểu, thâm thúy",
        "synonyms": [
          "obscure",
          "complex"
        ],
        "example": "His theories are too abstruse for the general public."
      },
      {
        "word": "alacrity",
        "pos": "noun",
        "phonetic": "/əˈlæk.rə.ti/",
        "translation": "Sự hăng hái, sốt sắng",
        "synonyms": [
          "eagerness",
          "readiness"
        ],
        "example": "She accepted the offer with alacrity."
      },
      {
        "word": "altruism",
        "pos": "noun",
        "phonetic": "/ˈæl.tru.ɪ.zəm/",
        "translation": "Lòng vị tha, vô tư",
        "synonyms": [
          "selflessness",
          "charity"
        ],
        "example": "Many choose to work in developing countries out of altruism."
      },
      {
        "word": "ambivalent",
        "pos": "adjective",
        "phonetic": "/æmˈbɪv.ə.lənt/",
        "translation": "Mâu thuẫn, vui buồn lẫn lộn",
        "synonyms": [
          "conflicted",
          "uncertain"
        ],
        "example": "I felt very ambivalent about leaving home."
      },
      {
        "word": "amorphous",
        "pos": "adjective",
        "phonetic": "/əˈmɔː.fəs/",
        "translation": "Không có hình dạng nhất định",
        "synonyms": [
          "shapeless",
          "formless"
        ],
        "example": "An amorphous mass of jelly."
      },
      {
        "word": "analogous",
        "pos": "adjective",
        "phonetic": "/əˈnæl.ə.ɡəs/",
        "translation": "Tương tự, giống nhau",
        "synonyms": [
          "comparable",
          "similar"
        ],
        "example": "The experience of mystic trance is in a sense analogous to sleep."
      },
      {
        "word": "animosity",
        "pos": "noun",
        "phonetic": "/ˌæn.ɪˈmɒs.ə.ti/",
        "translation": "Sự thù oán, ác cảm",
        "synonyms": [
          "hostility",
          "resentment"
        ],
        "example": "There is no personal animosity between the party leaders."
      },
      {
        "word": "antipathy",
        "pos": "noun",
        "phonetic": "/ænˈtɪp.ə.θi/",
        "translation": "Sự ác cảm, không thích",
        "synonyms": [
          "dislike",
          "aversion"
        ],
        "example": "He is a private man with a deep antipathy to the press."
      },
      {
        "word": "antithesis",
        "pos": "noun",
        "phonetic": "/ænˈtɪθ.ə.sɪs/",
        "translation": "Sự tương phản, đối lập tuyệt đối",
        "synonyms": [
          "opposite",
          "contrast"
        ],
        "example": "Love is the antithesis of selfishness."
      },
      {
        "word": "aphorism",
        "pos": "noun",
        "phonetic": "/ˈæf.ə.rɪ.zəm/",
        "translation": "Châm ngôn, ngạn ngữ",
        "synonyms": [
          "saying",
          "maxim"
        ],
        "example": "Oscar Wilde was famous for his aphorisms."
      },
      {
        "word": "apocryphal",
        "pos": "adjective",
        "phonetic": "/əˈpɒk.rɪ.fəl/",
        "translation": "Không xác thực, đáng nghi",
        "synonyms": [
          "fictitious",
          "unverified"
        ],
        "example": "It's a good story but I dare say it's apocryphal."
      },
      {
        "word": "arbitrary",
        "pos": "adjective",
        "phonetic": "/ˈɑː.bɪ.trər.i/",
        "translation": "Tùy tiện, độc đoán",
        "synonyms": [
          "random",
          "subjective"
        ],
        "example": "The decision seemed completely arbitrary."
      },
      {
        "word": "arcane",
        "pos": "adjective",
        "phonetic": "/ɑːˈkeɪn/",
        "translation": "Bí ẩn, ít người biết",
        "synonyms": [
          "mysterious",
          "esoteric"
        ],
        "example": "He was the only person who understood all the arcane details of the agreement."
      },
      {
        "word": "archaic",
        "pos": "adjective",
        "phonetic": "/ɑːˈkeɪ.ɪk/",
        "translation": "Cổ xưa, lỗi thời",
        "synonyms": [
          "obsolete",
          "ancient"
        ],
        "example": "The system is archaic and unfair."
      },
      {
        "word": "articulate",
        "pos": "adjective",
        "phonetic": "/ɑːˈtɪk.jə.lət/",
        "translation": "Ăn nói lưu loát, rõ ràng",
        "synonyms": [
          "eloquent",
          "fluent"
        ],
        "example": "She is an intelligent and highly articulate young woman."
      },
      {
        "word": "ascetic",
        "pos": "adjective",
        "phonetic": "/əˈset.ɪk/",
        "translation": "Khổ hạnh, tu hành",
        "synonyms": [
          "austere",
          "abstinent"
        ],
        "example": "They live a very ascetic life."
      },
      {
        "word": "assiduous",
        "pos": "adjective",
        "phonetic": "/əˈsɪd.ju.əs/",
        "translation": "Siêng năng, chuyên cần",
        "synonyms": [
          "diligent",
          "hard-working"
        ],
        "example": "The government has been assiduous in the fight against inflation."
      },
      {
        "word": "astute",
        "pos": "adjective",
        "phonetic": "/əˈstjuːt/",
        "translation": "Sắc sảo, tinh khôn",
        "synonyms": [
          "shrewd",
          "clever"
        ],
        "example": "He was an astute businessman who easily made a lot of money."
      },
      {
        "word": "augment",
        "pos": "verb",
        "phonetic": "/ɔːɡˈment/",
        "translation": "Làm tăng lên, mở rộng",
        "synonyms": [
          "increase",
          "supplement"
        ],
        "example": "He would have to find work to augment his income."
      },
      {
        "word": "banal",
        "pos": "adjective",
        "phonetic": "/bəˈnɑːl/",
        "translation": "Tầm thường, vô vị",
        "synonyms": [
          "trite",
          "hackneyed"
        ],
        "example": "He just sat there making banal remarks all evening."
      },
      {
        "word": "belie",
        "pos": "verb",
        "phonetic": "/bɪˈlaɪ/",
        "translation": "Gây hiểu lầm, che đậy",
        "synonyms": [
          "contradict",
          "disguise"
        ],
        "example": "Her calm face belied the terror she was feeling."
      },
      {
        "word": "benign",
        "pos": "adjective",
        "phonetic": "/bɪˈnaɪn/",
        "translation": "Lành tính, hiền lành",
        "synonyms": [
          "harmless",
          "kind"
        ],
        "example": "His humor was benign, never cruel or hurtful."
      },
      {
        "word": "blatant",
        "pos": "adjective",
        "phonetic": "/ˈbleɪ.tənt/",
        "translation": "Trắng trợn, hiển nhiên",
        "synonyms": [
          "flagrant",
          "obvious"
        ],
        "example": "It was a blatant lie."
      },
      {
        "word": "bucolic",
        "pos": "adjective",
        "phonetic": "/bjuːˈkɒl.ɪk/",
        "translation": "Đồng quê, bình dị",
        "synonyms": [
          "rustic",
          "pastoral"
        ],
        "example": "The painting shows a typically bucolic scene with peasants."
      },
      {
        "word": "burgeon",
        "pos": "verb",
        "phonetic": "/ˈbɜː.dʒən/",
        "translation": "Phát triển nhanh chóng",
        "synonyms": [
          "flourish",
          "thrive"
        ],
        "example": "Love burgeoned between them."
      },
      {
        "word": "candid",
        "pos": "adjective",
        "phonetic": "/ˈkæn.dɪd/",
        "translation": "Thẳng thắn, thật thà",
        "synonyms": [
          "frank",
          "honest"
        ],
        "example": "To be candid with you, I think you're making a dreadful mistake."
      },
      {
        "word": "cantankerous",
        "pos": "adjective",
        "phonetic": "/kænˈtæŋ.kər.əs/",
        "translation": "Khó tính, hay gắt gỏng",
        "synonyms": [
          "cranky",
          "irritable"
        ],
        "example": "He's getting a bit cantankerous in his old age."
      },
      {
        "word": "capitulate",
        "pos": "verb",
        "phonetic": "/kəˈpɪtʃ.ə.leɪt/",
        "translation": "Đầu hàng, khuất phục",
        "synonyms": [
          "surrender",
          "yield"
        ],
        "example": "The sports minister today capitulated to calls for his resignation."
      },
      {
        "word": "cathartic",
        "pos": "adjective",
        "phonetic": "/kəˈθɑː.tɪk/",
        "translation": "Giúp giải tỏa cảm xúc",
        "synonyms": [
          "cleansing",
          "therapeutic"
        ],
        "example": "Crying is a cathartic release."
      },
      {
        "word": "censure",
        "pos": "verb",
        "phonetic": "/ˈsen.ʃər/",
        "translation": "Chỉ trích dữ dội, khiển trách",
        "synonyms": [
          "condemn",
          "criticize"
        ],
        "example": "His dishonest behavior came under severe censure."
      },
      {
        "word": "charlatan",
        "pos": "noun",
        "phonetic": "/ˈʃɑː.lə.tən/",
        "translation": "Kẻ lừa đảo, lang băm",
        "synonyms": [
          "fraud",
          "quack"
        ],
        "example": "He was exposed as a charlatan."
      },
      {
        "word": "chicanery",
        "pos": "noun",
        "phonetic": "/ʃɪˈkeɪ.nər.i/",
        "translation": "Sự lừa lọc, dùng mánh khóe",
        "synonyms": [
          "trickery",
          "deception"
        ],
        "example": "The investigation revealed political chicanery and corruption."
      },
      {
        "word": "circumscribe",
        "pos": "verb",
        "phonetic": "/ˈsɜː.kəm.skraɪb/",
        "translation": "Giới hạn, hạn chế",
        "synonyms": [
          "restrict",
          "limit"
        ],
        "example": "Their movements have been strictly circumscribed."
      },
      {
        "word": "circumspect",
        "pos": "adjective",
        "phonetic": "/ˈsɜː.kəm.spekt/",
        "translation": "Thận trọng, cẩn thận",
        "synonyms": [
          "cautious",
          "wary"
        ],
        "example": "Officials were circumspect about saying what the talks had achieved."
      },
      {
        "word": "clandestine",
        "pos": "adjective",
        "phonetic": "/klænˈdes.tɪn/",
        "translation": "Giấu giếm, bí mật",
        "synonyms": [
          "secret",
          "covert"
        ],
        "example": "The group held weekly clandestine meetings in a church."
      },
      {
        "word": "clemency",
        "pos": "noun",
        "phonetic": "/ˈklem.ən.si/",
        "translation": "Sự khoan hồng, nhân từ",
        "synonyms": [
          "mercy",
          "leniency"
        ],
        "example": "The jury passed a verdict of guilty, with an appeal for clemency."
      },
      {
        "word": "coalesce",
        "pos": "verb",
        "phonetic": "/ˌkəʊ.əˈles/",
        "translation": "Hợp nhất, kết tụ",
        "synonyms": [
          "merge",
          "unite"
        ],
        "example": "The puddles had coalesced into shallow streams."
      },
      {
        "word": "cogent",
        "pos": "adjective",
        "phonetic": "/ˈkəʊ.dʒənt/",
        "translation": "Thuyết phục, chặt chẽ",
        "synonyms": [
          "convincing",
          "compelling"
        ],
        "example": "He makes a cogent argument for improving early childhood education."
      },
      {
        "word": "collusion",
        "pos": "noun",
        "phonetic": "/kəˈluː.ʒən/",
        "translation": "Sự thông đồng, cấu kết",
        "synonyms": [
          "conspiracy",
          "complicity"
        ],
        "example": "It is thought that they worked in collusion with the terrorist network."
      },
      {
        "word": "commensurate",
        "pos": "adjective",
        "phonetic": "/kəˈmen.sjə.rət/",
        "translation": "Tương xứng, phù hợp",
        "synonyms": [
          "proportionate",
          "equal"
        ],
        "example": "Salary will be commensurate with experience."
      },
      {
        "word": "concede",
        "pos": "verb",
        "phonetic": "/kənˈsiːd/",
        "translation": "Thừa nhận, nhượng bộ",
        "synonyms": [
          "admit",
          "yield"
        ],
        "example": "The government has conceded that the new tax policy has been a disaster."
      },
      {
        "word": "condescend",
        "pos": "verb",
        "phonetic": "/ˌkɒn.dɪˈsend/",
        "translation": "Hạ mình, hạ cố",
        "synonyms": [
          "patronize",
          "deign"
        ],
        "example": "He treats his players fairly and never condescends to them."
      },
      {
        "word": "confound",
        "pos": "verb",
        "phonetic": "/kənˈfaʊnd/",
        "translation": "Làm bối rối, làm ngạc nhiên",
        "synonyms": [
          "baffle",
          "confuse"
        ],
        "example": "The man confounded doctors by recovering."
      },
      {
        "word": "connoisseur",
        "pos": "noun",
        "phonetic": "/ˌkɒn.əˈsɜːr/",
        "translation": "Người am hiểu, chuyên gia",
        "synonyms": [
          "expert",
          "specialist"
        ],
        "example": "He was a man of wide knowledge, a connoisseur of art and music."
      },
      {
        "word": "contentious",
        "pos": "adjective",
        "phonetic": "/kənˈten.ʃəs/",
        "translation": "Hay tranh cãi, gây tranh cãi",
        "synonyms": [
          "controversial",
          "disputable"
        ],
        "example": "She has some very contentious views on education."
      },
      {
        "word": "contrite",
        "pos": "adjective",
        "phonetic": "/kənˈtraɪt/",
        "translation": "Ăn năn, hối lỗi",
        "synonyms": [
          "remorseful",
          "apologetic"
        ],
        "example": "She seemed genuinely contrite when she apologized."
      },
      {
        "word": "convoluted",
        "pos": "adjective",
        "phonetic": "/ˈkɒn.və.luː.tɪd/",
        "translation": "Phức tạp, rắc rối",
        "synonyms": [
          "complex",
          "complicated"
        ],
        "example": "His grammar explanations are terribly convoluted."
      },
      {
        "word": "copious",
        "pos": "adjective",
        "phonetic": "/ˈkəʊ.pi.əs/",
        "translation": "Phong phú, dồi dào",
        "synonyms": [
          "abundant",
          "plentiful"
        ],
        "example": "They drank copious amounts of wine."
      },
      {
        "word": "cosmopolitan",
        "pos": "adjective",
        "phonetic": "/ˌkɒz.məˈpɒl.ɪ.tən/",
        "translation": "Thuộc toàn thế giới, đa quốc gia",
        "synonyms": [
          "international",
          "global"
        ],
        "example": "New York is a highly cosmopolitan city."
      },
      {
        "word": "covert",
        "pos": "adjective",
        "phonetic": "/ˈkəʊ.vɜːt/",
        "translation": "Che đậy, bí mật",
        "synonyms": [
          "secret",
          "stealthy"
        ],
        "example": "The government was accused of covert military operations."
      },
      {
        "word": "covet",
        "pos": "verb",
        "phonetic": "/ˈkʌv.ɪt/",
        "translation": "Thèm khát, thèm muốn",
        "synonyms": [
          "desire",
          "crave"
        ],
        "example": "She always coveted power but never quite achieved it."
      },
      {
        "word": "craven",
        "pos": "adjective",
        "phonetic": "/ˈkreɪ.vən/",
        "translation": "Hèn nhát",
        "synonyms": [
          "cowardly",
          "fearful"
        ],
        "example": "He had a craven fear of flying."
      },
      {
        "word": "cryptic",
        "pos": "adjective",
        "phonetic": "/ˈkrɪp.tɪk/",
        "translation": "Bí ẩn, khó hiểu",
        "synonyms": [
          "enigmatic",
          "mysterious"
        ],
        "example": "I got a cryptic text message from Sam."
      },
      {
        "word": "culminate",
        "pos": "verb",
        "phonetic": "/ˈkʌl.mɪ.neɪt/",
        "translation": "Lên đến đỉnh điểm, kết thúc bằng",
        "synonyms": [
          "peak",
          "climax"
        ],
        "example": "Their research culminated in a cure."
      },
      {
        "word": "cursory",
        "pos": "adjective",
        "phonetic": "/ˈkɜː.sər.i/",
        "translation": "Lướt qua, vội vàng",
        "synonyms": [
          "superficial",
          "hasty"
        ],
        "example": "He gave the picture a cursory glance."
      },
      {
        "word": "daunt",
        "pos": "verb",
        "phonetic": "/dɔːnt/",
        "translation": "Làm nản chí, làm sợ hãi",
        "synonyms": [
          "intimidate",
          "discourage"
        ],
        "example": "She was not at all daunted by the size of the problem."
      },
      {
        "word": "debacle",
        "pos": "noun",
        "phonetic": "/deɪˈbɑː.kəl/",
        "translation": "Sự thất bại nặng nề, sụp đổ",
        "synonyms": [
          "fiasco",
          "disaster"
        ],
        "example": "The collapse of the company was a monumental debacle."
      },
      {
        "word": "decorum",
        "pos": "noun",
        "phonetic": "/dɪˈkɔː.rəm/",
        "translation": "Sự đúng mực, đoan trang",
        "synonyms": [
          "propriety",
          "decency"
        ],
        "example": "We were expected to act with proper decorum."
      },
      {
        "word": "deleterious",
        "pos": "adjective",
        "phonetic": "/ˌdel.ɪˈtɪə.ri.əs/",
        "translation": "Có hại, độc hại",
        "synonyms": [
          "harmful",
          "detrimental"
        ],
        "example": "These drugs have a deleterious effect on the nervous system."
      },
      {
        "word": "demure",
        "pos": "adjective",
        "phonetic": "/dɪˈmjʊər/",
        "translation": "Nghiêm trang, từ tốn, kín đáo",
        "synonyms": [
          "modest",
          "reserved"
        ],
        "example": "She gave him a demure smile."
      },
      {
        "word": "denigrate",
        "pos": "verb",
        "phonetic": "/ˈden.ɪ.ɡreɪt/",
        "translation": "Gièm pha, chê bai",
        "synonyms": [
          "belittle",
          "disparage"
        ],
        "example": "You shouldn't denigrate people with different beliefs."
      },
      {
        "word": "deprecate",
        "pos": "verb",
        "phonetic": "/ˈdep.rə.keɪt/",
        "translation": "Phản đối, không tán thành",
        "synonyms": [
          "condemn",
          "disapprove"
        ],
        "example": "We deprecate this use of company funds for political purposes."
      },
      {
        "word": "derogatory",
        "pos": "adjective",
        "phonetic": "/dɪˈrɒɡ.ə.tər.i/",
        "translation": "Xúc phạm, làm giảm giá trị",
        "synonyms": [
          "disparaging",
          "insulting"
        ],
        "example": "He made some derogatory comment about her appearance."
      },
      {
        "word": "despondent",
        "pos": "adjective",
        "phonetic": "/dɪˈspɒn.dənt/",
        "translation": "Nản lòng, tuyệt vọng",
        "synonyms": [
          "depressed",
          "disheartened"
        ],
        "example": "He became increasingly despondent when she didn't call."
      },
      {
        "word": "despot",
        "pos": "noun",
        "phonetic": "/ˈdes.pɒt/",
        "translation": "Bạo chúa, kẻ độc tài",
        "synonyms": [
          "tyrant",
          "dictator"
        ],
        "example": "An enlightened despot."
      },
      {
        "word": "destitute",
        "pos": "adjective",
        "phonetic": "/ˈdes.tɪ.tʃuːt/",
        "translation": "Thiếu thốn, bần cùng",
        "synonyms": [
          "impoverished",
          "poor"
        ],
        "example": "The floods left thousands of people destitute."
      },
      {
        "word": "desultory",
        "pos": "adjective",
        "phonetic": "/ˈdes.əl.tər.i/",
        "translation": "Rời rạc, thiếu mục đích",
        "synonyms": [
          "aimless",
          "random"
        ],
        "example": "She made a desultory attempt at conversation."
      },
      {
        "word": "dexterous",
        "pos": "adjective",
        "phonetic": "/ˈdek.stər.əs/",
        "translation": "Khéo léo, dẻo dai",
        "synonyms": [
          "skillful",
          "adroit"
        ],
        "example": "He's very dexterous with his hands."
      },
      {
        "word": "dichotomy",
        "pos": "noun",
        "phonetic": "/daɪˈkɒt.ə.mi/",
        "translation": "Sự phân đôi, mâu thuẫn",
        "synonyms": [
          "division",
          "split"
        ],
        "example": "There is often a dichotomy between what politicians say and do."
      },
      {
        "word": "diffident",
        "pos": "adjective",
        "phonetic": "/ˈdɪf.ɪ.dənt/",
        "translation": "Thiếu tự tin, rụt rè",
        "synonyms": [
          "shy",
          "timid"
        ],
        "example": "You shouldn't be so diffident about your achievements."
      },
      {
        "word": "dilatory",
        "pos": "adjective",
        "phonetic": "/ˈdɪl.ə.tər.i/",
        "translation": "Chậm chạp, lề mề",
        "synonyms": [
          "delaying",
          "sluggish"
        ],
        "example": "Institutions have been dilatory in cutting emissions."
      },
      {
        "word": "dilettante",
        "pos": "noun",
        "phonetic": "/ˌdɪl.əˈtæn.ti/",
        "translation": "Người am hiểu hời hợt, tay ngang",
        "synonyms": [
          "amateur",
          "dabbler"
        ],
        "example": "He's a bit of a dilettante as far as wine is concerned."
      },
      {
        "word": "disabuse",
        "pos": "verb",
        "phonetic": "/ˌdɪs.əˈbjuːz/",
        "translation": "Làm cho tỉnh ngộ, nhận ra sai lầm",
        "synonyms": [
          "undeceive",
          "enlighten"
        ],
        "example": "She soon disabused him of that idea."
      },
      {
        "word": "discern",
        "pos": "verb",
        "phonetic": "/dɪˈsɜːn/",
        "translation": "Nhận thức, thấy rõ",
        "synonyms": [
          "perceive",
          "detect"
        ],
        "example": "I could just discern a figure in the darkness."
      },
      {
        "word": "discordant",
        "pos": "adjective",
        "phonetic": "/dɪˈskɔː.dənt/",
        "translation": "Bất hòa, trái ngược, chói tai",
        "synonyms": [
          "conflicting",
          "dissonant"
        ],
        "example": "The contemporary dialogue strikes a discordant note."
      },
      {
        "word": "discrepancy",
        "pos": "noun",
        "phonetic": "/dɪˈskrep.ən.si/",
        "translation": "Sự khác biệt, không nhất quán",
        "synonyms": [
          "inconsistency",
          "difference"
        ],
        "example": "There is some discrepancy between the two accounts."
      },
      {
        "word": "disparate",
        "pos": "adjective",
        "phonetic": "/ˈdɪs.pər.ət/",
        "translation": "Khác hẳn nhau, tạp nham",
        "synonyms": [
          "different",
          "contrasting"
        ],
        "example": "The two cultures were utterly disparate."
      },
      {
        "word": "disseminate",
        "pos": "verb",
        "phonetic": "/dɪˈsem.ɪ.neɪt/",
        "translation": "Gieo rắc, phổ biến",
        "synonyms": [
          "spread",
          "circulate"
        ],
        "example": "The organization disseminates information about the disease."
      },
      {
        "word": "dormant",
        "pos": "adjective",
        "phonetic": "/ˈdɔː.mənt/",
        "translation": "Nằm im, ngủ đông, tiềm ẩn",
        "synonyms": [
          "inactive",
          "latent"
        ],
        "example": "The long-dormant volcano has recently shown signs of erupting."
      },
      {
        "word": "duplicity",
        "pos": "noun",
        "phonetic": "/dʒuːˈplɪs.ə.ti/",
        "translation": "Sự hai mặt, lừa dối",
        "synonyms": [
          "deceit",
          "double-dealing"
        ],
        "example": "They were accused of duplicity in their dealings."
      },
      {
        "word": "eccentric",
        "pos": "adjective",
        "phonetic": "/ɪkˈsen.trɪk/",
        "translation": "Kỳ dị, lập dị",
        "synonyms": [
          "unconventional",
          "odd"
        ],
        "example": "His eccentric behavior lost him his job."
      },
      {
        "word": "edify",
        "pos": "verb",
        "phonetic": "/ˈed.ɪ.faɪ/",
        "translation": "Khai sáng, nâng cao trí tuệ",
        "synonyms": [
          "enlighten",
          "instruct"
        ],
        "example": "Programs that edify as well as entertain."
      },
      {
        "word": "efface",
        "pos": "verb",
        "phonetic": "/ɪˈfeɪs/",
        "translation": "Xóa bỏ, làm mờ đi",
        "synonyms": [
          "erase",
          "obliterate"
        ],
        "example": "The country tried to efface the memory of the dictatorship."
      },
      {
        "word": "effervescent",
        "pos": "adjective",
        "phonetic": "/ˌef.əˈves.ənt/",
        "translation": "Sôi nổi, sủi bọt",
        "synonyms": [
          "bubbly",
          "lively"
        ],
        "example": "She's one of those happy, effervescent people."
      },
      {
        "word": "egalitarian",
        "pos": "adjective",
        "phonetic": "/ɪˌɡæl.ɪˈteə.ri.ən/",
        "translation": "Bình đẳng",
        "synonyms": [
          "equal",
          "democratic"
        ],
        "example": "The party's principles are basically egalitarian."
      },
      {
        "word": "egregious",
        "pos": "adjective",
        "phonetic": "/ɪˈɡriː.dʒəs/",
        "translation": "Cực kỳ tồi tệ, trắng trợn",
        "synonyms": [
          "flagrant",
          "atrocious"
        ],
        "example": "It was an egregious error for a statesman."
      },
      {
        "word": "elicit",
        "pos": "verb",
        "phonetic": "/iˈlɪs.ɪt/",
        "translation": "Khêu gợi, moi ra thông tin",
        "synonyms": [
          "extract",
          "evoke"
        ],
        "example": "Have you managed to elicit a response from them yet?"
      },
      {
        "word": "eloquent",
        "pos": "adjective",
        "phonetic": "/ˈel.ə.kwənt/",
        "translation": "Có tài hùng biện, diễn đạt tốt",
        "synonyms": [
          "articulate",
          "expressive"
        ],
        "example": "She made an eloquent appeal for action."
      },
      {
        "word": "embellish",
        "pos": "verb",
        "phonetic": "/ɪmˈbel.ɪʃ/",
        "translation": "Tô điểm, thêm mắm dặm muối",
        "synonyms": [
          "decorate",
          "exaggerate"
        ],
        "example": "He couldn't resist embellishing the story of his accident."
      },
      {
        "word": "empirical",
        "pos": "adjective",
        "phonetic": "/ɪmˈpɪr.ɪ.kəl/",
        "translation": "Dựa trên kinh nghiệm/thực nghiệm",
        "synonyms": [
          "observational",
          "experimental"
        ],
        "example": "This theory needs to be backed up with empirical data."
      },
      {
        "word": "endemic",
        "pos": "adjective",
        "phonetic": "/enˈdem.ɪk/",
        "translation": "Đặc hữu, thường trực",
        "synonyms": [
          "native",
          "prevalent"
        ],
        "example": "Malaria is endemic in many hotter regions."
      },
      {
        "word": "ennui",
        "pos": "noun",
        "phonetic": "/ɒnˈwiː/",
        "translation": "Sự buồn chán, chán chường",
        "synonyms": [
          "boredom",
          "lethargy"
        ],
        "example": "The country is affected by the ennui of winter."
      },
      {
        "word": "entrench",
        "pos": "verb",
        "phonetic": "/ɪnˈtrentʃ/",
        "translation": "Cố thủ, bén rễ sâu",
        "synonyms": [
          "establish",
          "root"
        ],
        "example": "Prevent inflation from entrenching itself."
      },
      {
        "word": "epitome",
        "pos": "noun",
        "phonetic": "/ɪˈpɪt.ə.mi/",
        "translation": "Tấm gương hoàn hảo, hình ảnh thu nhỏ",
        "synonyms": [
          "embodiment",
          "paradigm"
        ],
        "example": "She is the epitome of French elegance."
      },
      {
        "word": "equanimity",
        "pos": "noun",
        "phonetic": "/ˌek.wəˈnɪm.ə.ti/",
        "translation": "Sự bình thản, điềm tĩnh",
        "synonyms": [
          "composure",
          "calmness"
        ],
        "example": "He received the news with remarkable equanimity."
      },
      {
        "word": "equitable",
        "pos": "adjective",
        "phonetic": "/ˈek.wɪ.tə.bəl/",
        "translation": "Công bằng, vô tư",
        "synonyms": [
          "fair",
          "just"
        ],
        "example": "An equitable distribution of resources."
      },
      {
        "word": "errant",
        "pos": "adjective",
        "phonetic": "/ˈer.ənt/",
        "translation": "Lầm lỗi, đi lang thang",
        "synonyms": [
          "wandering",
          "offending"
        ],
        "example": "An errant husband."
      },
      {
        "word": "espouse",
        "pos": "verb",
        "phonetic": "/esˈpaʊz/",
        "translation": "Tán thành, ủng hộ",
        "synonyms": [
          "adopt",
          "support"
        ],
        "example": "Vegetarianism is one cause she does not espouse."
      },
      {
        "word": "ethereal",
        "pos": "adjective",
        "phonetic": "/ɪˈθɪə.ri.əl/",
        "translation": "Thanh tao, siêu trần",
        "synonyms": [
          "delicate",
          "heavenly"
        ],
        "example": "An ethereal beauty."
      },
      {
        "word": "euphemism",
        "pos": "noun",
        "phonetic": "/ˈjuː.fə.mɪ.zəm/",
        "translation": "Uyển ngữ, nói giảm nói tránh",
        "synonyms": [
          "polite term",
          "substitute"
        ],
        "example": "\"Senior citizen\" is a euphemism for \"old person\"."
      },
      {
        "word": "exacting",
        "pos": "adjective",
        "phonetic": "/ɪɡˈzæk.tɪŋ/",
        "translation": "Đòi hỏi cao, khắt khe",
        "synonyms": [
          "demanding",
          "strict"
        ],
        "example": "An exacting training schedule."
      },
      {
        "word": "exalt",
        "pos": "verb",
        "phonetic": "/ɪɡˈzɒlt/",
        "translation": "Đề cao, tâng bốc",
        "synonyms": [
          "praise",
          "elevate"
        ],
        "example": "His behavior has exalted him in the eyes of the world."
      },
      {
        "word": "exasperate",
        "pos": "verb",
        "phonetic": "/ɪɡˈzɑː.spə.reɪt/",
        "translation": "Làm bực tức, phát cáu",
        "synonyms": [
          "infuriate",
          "annoy"
        ],
        "example": "His empty promises exasperated her."
      },
      {
        "word": "exculpate",
        "pos": "verb",
        "phonetic": "/ˈek.skʌl.peɪt/",
        "translation": "Giải tội, bào chữa",
        "synonyms": [
          "absolve",
          "exonerate"
        ],
        "example": "The pilot will surely be exculpated."
      },
      {
        "word": "exhort",
        "pos": "verb",
        "phonetic": "/ɪɡˈzɔːt/",
        "translation": "Cổ vũ, hô hào",
        "synonyms": [
          "urge",
          "encourage"
        ],
        "example": "The governor exhorted the prisoners not to riot."
      },
      {
        "word": "exorbitant",
        "pos": "adjective",
        "phonetic": "/ɪɡˈzɔː.bɪ.tənt/",
        "translation": "Cắt cổ, thái quá",
        "synonyms": [
          "excessive",
          "astronomical"
        ],
        "example": "The bill for dinner was exorbitant."
      },
      {
        "word": "expedient",
        "pos": "adjective",
        "phonetic": "/ɪkˈspiː.di.ənt/",
        "translation": "Có lợi, thiết thực",
        "synonyms": [
          "convenient",
          "practical"
        ],
        "example": "It might be expedient not to pay him in advance."
      },
      {
        "word": "expedite",
        "pos": "verb",
        "phonetic": "/ˈek.spə.daɪt/",
        "translation": "Xúc tiến, thúc đẩy",
        "synonyms": [
          "accelerate",
          "hasten"
        ],
        "example": "Something needs to be done to expedite the process."
      },
      {
        "word": "extol",
        "pos": "verb",
        "phonetic": "/ɪkˈstəʊl/",
        "translation": "Tán dương, ca tụng",
        "synonyms": [
          "praise",
          "exalt"
        ],
        "example": "His book extolling vegetarianism sold thousands of copies."
      },
      {
        "word": "extrapolate",
        "pos": "verb",
        "phonetic": "/ɪkˈstræp.ə.leɪt/",
        "translation": "Ngoại suy, suy diễn",
        "synonyms": [
          "deduce",
          "infer"
        ],
        "example": "You can't extrapolate a trend from such a small sample."
      },
      {
        "word": "extricate",
        "pos": "verb",
        "phonetic": "/ˈek.strɪ.keɪt/",
        "translation": "Giải thoát, gỡ rối",
        "synonyms": [
          "free",
          "disentangle"
        ],
        "example": "It took hours to extricate the car from the sand."
      },
      {
        "word": "exuberant",
        "pos": "adjective",
        "phonetic": "/ɪɡˈzjuː.bər.ənt/",
        "translation": "Tràn đầy năng lượng, hân hoan",
        "synonyms": [
          "enthusiastic",
          "lively"
        ],
        "example": "Young and exuberant, he symbolizes vitality."
      },
      {
        "word": "fabricate",
        "pos": "verb",
        "phonetic": "/ˈfæb.rɪ.keɪt/",
        "translation": "Bịa đặt, chế tạo",
        "synonyms": [
          "invent",
          "forge"
        ],
        "example": "He fabricated an excuse to avoid trouble."
      },
      {
        "word": "fallacious",
        "pos": "adjective",
        "phonetic": "/fəˈleɪ.ʃəs/",
        "translation": "Sai lầm, dựa trên ngụy biện",
        "synonyms": [
          "false",
          "misleading"
        ],
        "example": "His argument is based on fallacious reasoning."
      },
      {
        "word": "fathom",
        "pos": "verb",
        "phonetic": "/ˈfæð.əm/",
        "translation": "Hiểu thấu",
        "synonyms": [
          "comprehend",
          "understand"
        ],
        "example": "People have been trying to fathom the mysteries of the whale's song."
      },
      {
        "word": "fatuous",
        "pos": "adjective",
        "phonetic": "/ˈfætʃ.u.əs/",
        "translation": "Ngu ngốc, ngớ ngẩn",
        "synonyms": [
          "silly",
          "foolish"
        ],
        "example": "A fatuous idea."
      },
      {
        "word": "feasible",
        "pos": "adjective",
        "phonetic": "/ˈfiː.zə.bəl/",
        "translation": "Khả thi, làm được",
        "synonyms": [
          "possible",
          "practical"
        ],
        "example": "With the extra resources, the project now seems feasible."
      },
      {
        "word": "fecund",
        "pos": "adjective",
        "phonetic": "/ˈfek.ənd/",
        "translation": "Mắn đẻ, màu mỡ, phong phú",
        "synonyms": [
          "fertile",
          "productive"
        ],
        "example": "The fecund soil of the delta."
      },
      {
        "word": "felicitous",
        "pos": "adjective",
        "phonetic": "/fəˈlɪs.ɪ.təs/",
        "translation": "Rất thích hợp, khéo léo",
        "synonyms": [
          "apt",
          "appropriate"
        ],
        "example": "He summed up Jack's achievements in a felicitous phrase."
      },
      {
        "word": "fickle",
        "pos": "adjective",
        "phonetic": "/ˈfɪk.əl/",
        "translation": "Hay thay đổi, không kiên định",
        "synonyms": [
          "capricious",
          "unstable"
        ],
        "example": "The weather here is notoriously fickle."
      },
      {
        "word": "flamboyant",
        "pos": "adjective",
        "phonetic": "/flæmˈbɔɪ.ənt/",
        "translation": "Chói lọi, phô trương",
        "synonyms": [
          "showy",
          "ostentatious"
        ],
        "example": "His clothes were flamboyant for a serious occasion."
      },
      {
        "word": "flaunt",
        "pos": "verb",
        "phonetic": "/flɔːnt/",
        "translation": "Khoe khoang, phô trương",
        "synonyms": [
          "show off",
          "parade"
        ],
        "example": "He's got money but he doesn't flaunt it."
      },
      {
        "word": "flippant",
        "pos": "adjective",
        "phonetic": "/ˈflɪp.ənt/",
        "translation": "Cợt nhả, thiếu nghiêm túc",
        "synonyms": [
          "frivolous",
          "disrespectul"
        ],
        "example": "It's easy to be flippant, but we have a serious problem."
      },
      {
        "word": "florid",
        "pos": "adjective",
        "phonetic": "/ˈflɒr.ɪd/",
        "translation": "Hoa mỹ, đỏ ửng",
        "synonyms": [
          "ornate",
          "elaborative"
        ],
        "example": "A florid architectural style."
      },
      {
        "word": "flout",
        "pos": "verb",
        "phonetic": "/flaʊt/",
        "translation": "Coi thường, miệt thị luật lệ",
        "synonyms": [
          "defy",
          "disregard"
        ],
        "example": "Many motorcyclists flout the law by not wearing helmets."
      },
      {
        "word": "foment",
        "pos": "verb",
        "phonetic": "/fəʊˈment/",
        "translation": "Kích động, xúi giục",
        "synonyms": [
          "instigate",
          "provoke"
        ],
        "example": "The song might foment racial tension."
      },
      {
        "word": "forestall",
        "pos": "verb",
        "phonetic": "/fɔːˈstɔːl/",
        "translation": "Chặn trước, đón đầu",
        "synonyms": [
          "prevent",
          "preempt"
        ],
        "example": "They forestalled criticism by inviting union leaders."
      },
      {
        "word": "fortuitous",
        "pos": "adjective",
        "phonetic": "/fɔːˈtjuː.ɪ.təs/",
        "translation": "Tình cờ, may mắn",
        "synonyms": [
          "accidental",
          "lucky"
        ],
        "example": "The timing of the meeting is certainly fortuitous."
      },
      {
        "word": "fractious",
        "pos": "adjective",
        "phonetic": "/ˈfræk.ʃəs/",
        "translation": "Cáu kỉnh, hay gây gổ",
        "synonyms": [
          "irritable",
          "peevish"
        ],
        "example": "Children become fractious when they are tired."
      },
      {
        "word": "frivolous",
        "pos": "adjective",
        "phonetic": "/ˈfrɪv.əl.əs/",
        "translation": "Phù phiếm, ngớ ngẩn",
        "synonyms": [
          "trivial",
          "foolish"
        ],
        "example": "She is seen as a frivolous young woman."
      },
      {
        "word": "furtive",
        "pos": "adjective",
        "phonetic": "/ˈfɜː.tɪv/",
        "translation": "Lén lút, mờ ám",
        "synonyms": [
          "secretive",
          "stealthy"
        ],
        "example": "He cast a furtive glance at the woman."
      },
      {
        "word": "futile",
        "pos": "adjective",
        "phonetic": "/ˈfjuː.taɪl/",
        "translation": "Vô ích, không hiệu quả",
        "synonyms": [
          "pointless",
          "useless"
        ],
        "example": "Attempts to get supplies to the region are futile."
      },
      {
        "word": "galvanize",
        "pos": "verb",
        "phonetic": "/ˈɡæl.və.naɪz/",
        "translation": "Kích động, làm phấn khởi lên",
        "synonyms": [
          "stimulate",
          "rouse"
        ],
        "example": "Charities were galvanized by TV pictures of starving people."
      },
      {
        "word": "garish",
        "pos": "adjective",
        "phonetic": "/ˈɡeə.rɪʃ/",
        "translation": "Lòe loẹt, sặc sỡ",
        "synonyms": [
          "gaudy",
          "flashy"
        ],
        "example": "A pair of garish shorts."
      },
      {
        "word": "gauche",
        "pos": "adjective",
        "phonetic": "/ɡəʊʃ/",
        "translation": "Vụng về, thiếu tế nhị",
        "synonyms": [
          "awkward",
          "clumsy"
        ],
        "example": "She grew from a gauche teenager to a self-assured woman."
      },
      {
        "word": "germane",
        "pos": "adjective",
        "phonetic": "/dʒɜːˈmeɪn/",
        "translation": "Phù hợp, có liên quan chặt chẽ",
        "synonyms": [
          "relevant",
          "applicable"
        ],
        "example": "Her remarks were germane to the discussion."
      },
      {
        "word": "glib",
        "pos": "adjective",
        "phonetic": "/ɡlɪb/",
        "translation": "Lém lỉnh, liến thoắng",
        "synonyms": [
          "slick",
          "smooth-talking"
        ],
        "example": "He's a glib, self-centered man."
      },
      {
        "word": "grandiloquent",
        "pos": "adjective",
        "phonetic": "/ɡrænˈdɪl.ə.kwənt/",
        "translation": "Khoa trương, đao to búa lớn",
        "synonyms": [
          "pompous",
          "bombastic"
        ],
        "example": "Her speech was full of grandiloquent language."
      },
      {
        "word": "guile",
        "pos": "noun",
        "phonetic": "/ɡaɪl/",
        "translation": "Sự xảo quyệt, mưu mẹo",
        "synonyms": [
          "cunning",
          "deceit"
        ],
        "example": "She will need political guile to stay in power."
      },
      {
        "word": "hapless",
        "pos": "adjective",
        "phonetic": "/ˈhæp.ləs/",
        "translation": "Bất hạnh, rủi ro",
        "synonyms": [
          "unlucky",
          "unfortunate"
        ],
        "example": "Many children are hapless victims of this war."
      },
      {
        "word": "harangue",
        "pos": "noun",
        "phonetic": "/həˈræŋ/",
        "translation": "Bài diễn thuyết đanh thép, chỉ trích",
        "synonyms": [
          "tirade",
          "diatribe"
        ],
        "example": "A drunk was haranguing passers-by."
      },
      {
        "word": "hegemony",
        "pos": "noun",
        "phonetic": "/hɪˈdʒem.ə.ni/",
        "translation": "Quyền bá chủ, sự lãnh đạo",
        "synonyms": [
          "dominance",
          "supremacy"
        ],
        "example": "They united to resist the hegemony of their neighbor."
      },
      {
        "word": "heresy",
        "pos": "noun",
        "phonetic": "/ˈher.ə.si/",
        "translation": "Dị giáo, ý kiến đi ngược số đông",
        "synonyms": [
          "unorthodoxy",
          "dissent"
        ],
        "example": "She committed the heresy of playing a pop song on a classical station."
      },
      {
        "word": "heterogeneous",
        "pos": "adjective",
        "phonetic": "/ˌhet.ər.əˈdʒiː.ni.əs/",
        "translation": "Hỗn tạp, khác biệt",
        "synonyms": [
          "diverse",
          "varied"
        ],
        "example": "A heterogeneous confederation of cantons."
      },
      {
        "word": "hiatus",
        "pos": "noun",
        "phonetic": "/haɪˈeɪ.təs/",
        "translation": "Khoảng nghỉ, gián đoạn",
        "synonyms": [
          "break",
          "pause"
        ],
        "example": "Production will resume after a two-month hiatus."
      },
      {
        "word": "hierarchy",
        "pos": "noun",
        "phonetic": "/ˈhaɪə.rɑː.ki/",
        "translation": "Hệ thống cấp bậc",
        "synonyms": [
          "ranking",
          "pecking order"
        ],
        "example": "Monkeys have a complex social hierarchy."
      },
      {
        "word": "homogeneous",
        "pos": "adjective",
        "phonetic": "/ˌhɒm.əˈdʒiː.ni.əs/",
        "translation": "Đồng nhất, cùng loại",
        "synonyms": [
          "uniform",
          "unvarying"
        ],
        "example": "The population has remained remarkably homogeneous."
      },
      {
        "word": "hubris",
        "pos": "noun",
        "phonetic": "/ˈhjuː.brɪs/",
        "translation": "Sự ngạo mạn, kiêu ngạo",
        "synonyms": [
          "arrogance",
          "conceit"
        ],
        "example": "He was punished for his hubris."
      },
      {
        "word": "hyperbole",
        "pos": "noun",
        "phonetic": "/haɪˈpɜː.bəl.i/",
        "translation": "Biện pháp nói quá, phóng đại",
        "synonyms": [
          "exaggeration",
          "overstatement"
        ],
        "example": "The book was full of the usual hyperbole."
      },
      {
        "word": "ignominy",
        "pos": "noun",
        "phonetic": "/ˈɪɡ.nə.mɪ.ni/",
        "translation": "Sự nhục nhã, ô nhục",
        "synonyms": [
          "disgrace",
          "shame"
        ],
        "example": "The ignominy of being imprisoned."
      },
      {
        "word": "illicit",
        "pos": "adjective",
        "phonetic": "/ɪˈlɪs.ɪt/",
        "translation": "Trái phép, lậu",
        "synonyms": [
          "illegal",
          "unlawful"
        ],
        "example": "Illicit drugs such as cocaine."
      },
      {
        "word": "imminent",
        "pos": "adjective",
        "phonetic": "/ˈɪm.ɪ.nənt/",
        "translation": "Sắp xảy ra, tới nơi",
        "synonyms": [
          "impending",
          "approaching"
        ],
        "example": "Imminent disaster."
      },
      {
        "word": "immutable",
        "pos": "adjective",
        "phonetic": "/ɪˈmjuː.tə.bəl/",
        "translation": "Không thể thay đổi, bất biến",
        "synonyms": [
          "unchangeable",
          "absolute"
        ],
        "example": "Grammar is an immutable set of rules."
      },
      {
        "word": "impair",
        "pos": "verb",
        "phonetic": "/ɪmˈpeər/",
        "translation": "Làm suy yếu, làm hỏng",
        "synonyms": [
          "damage",
          "harm"
        ],
        "example": "A knee injury impaired his chances of winning."
      },
      {
        "word": "impartial",
        "pos": "adjective",
        "phonetic": "/ɪmˈpɑː.ʃəl/",
        "translation": "Công bằng, vô tư",
        "synonyms": [
          "unbiased",
          "neutral"
        ],
        "example": "A trial must be fair and impartial."
      },
      {
        "word": "impeccable",
        "pos": "adjective",
        "phonetic": "/ɪmˈpek.ə.bəl/",
        "translation": "Hoàn hảo, không tì vết",
        "synonyms": [
          "flawless",
          "perfect"
        ],
        "example": "His English is impeccable."
      },
      {
        "word": "impediment",
        "pos": "noun",
        "phonetic": "/ɪmˈped.ɪ.mənt/",
        "translation": "Sự trở ngại, rào cản",
        "synonyms": [
          "obstacle",
          "barrier"
        ],
        "example": "War has been an impediment to progress."
      },
      {
        "word": "imperative",
        "pos": "adjective",
        "phonetic": "/ɪmˈper.ə.tɪv/",
        "translation": "Bắt buộc, cấp bách",
        "synonyms": [
          "crucial",
          "vital"
        ],
        "example": "It's imperative to act now."
      },
      {
        "word": "imperious",
        "pos": "adjective",
        "phonetic": "/ɪmˈpɪə.ri.əs/",
        "translation": "Hống hách, độc đoán",
        "synonyms": [
          "commanding",
          "domineering"
        ],
        "example": "An imperious, insolent woman."
      },
      {
        "word": "imperturbable",
        "pos": "adjective",
        "phonetic": "/ˌɪm.pəˈtɜː.bə.bəl/",
        "translation": "Bình tĩnh, không hề nao núng",
        "synonyms": [
          "calm",
          "composed"
        ],
        "example": "He was imperturbable in a crisis."
      },
      {
        "word": "impervious",
        "pos": "adjective",
        "phonetic": "/ɪmˈpɜː.vi.əs/",
        "translation": "Không thể xuyên thấu, không bị ảnh hưởng",
        "synonyms": [
          "resistant",
          "unaffected"
        ],
        "example": "He is impervious to criticism."
      },
      {
        "word": "implicit",
        "pos": "adjective",
        "phonetic": "/ɪmˈplɪs.ɪt/",
        "translation": "Ngầm hiểu, không nói ra",
        "synonyms": [
          "implied",
          "unspoken"
        ],
        "example": "An implicit criticism of the government."
      },
      {
        "word": "imprudent",
        "pos": "adjective",
        "phonetic": "/ɪmˈpruː.dənt/",
        "translation": "Không khôn ngoan, khinh suất",
        "synonyms": [
          "unwise",
          "reckless"
        ],
        "example": "The banks were imprudent in their lending."
      },
      {
        "word": "impudent",
        "pos": "adjective",
        "phonetic": "/ˈɪm.pjə.dənt/",
        "translation": "Láo xược, trơ tráo",
        "synonyms": [
          "insolent",
          "brazen"
        ],
        "example": "An impudent remark."
      },
      {
        "word": "impugn",
        "pos": "verb",
        "phonetic": "/ɪmˈpjuːn/",
        "translation": "Nghi ngờ, công kích",
        "synonyms": [
          "challenge",
          "question"
        ],
        "example": "Are you impugning my competence?"
      },
      {
        "word": "inadvertent",
        "pos": "adjective",
        "phonetic": "/ˌɪn.ədˈvɜː.tənt/",
        "translation": "Vô ý, không cố ý",
        "synonyms": [
          "unintentional",
          "accidental"
        ],
        "example": "Inadvertent copying of other people's ideas."
      },
      {
        "word": "incessant",
        "pos": "adjective",
        "phonetic": "/ɪnˈses.ənt/",
        "translation": "Không ngừng, liên miên",
        "synonyms": [
          "constant",
          "nonstop"
        ],
        "example": "Incessant rain made conditions intolerable."
      },
      {
        "word": "incisive",
        "pos": "adjective",
        "phonetic": "/ɪnˈsaɪ.sɪv/",
        "translation": "Sắc bén, nhạy bén",
        "synonyms": [
          "sharp",
          "keen"
        ],
        "example": "Incisive questions."
      },
      {
        "word": "incongruous",
        "pos": "adjective",
        "phonetic": "/ɪnˈkɒŋ.ɡru.əs/",
        "translation": "Không hợp lý, lạc lõng",
        "synonyms": [
          "inappropriate",
          "out of place"
        ],
        "example": "The computer looked incongruous in the dark library."
      },
      {
        "word": "judicious",
        "pos": "adjective",
        "phonetic": "/dʒuːˈdɪʃ.əs/",
        "translation": "Sáng suốt, khôn ngoan",
        "synonyms": [
          "wise",
          "sensible"
        ],
        "example": "We should make judicious use of the resources available to us."
      },
      {
        "word": "juxtaposition",
        "pos": "noun",
        "phonetic": "/ˌdʒʌk.stə.pəˈzɪʃ.ən/",
        "translation": "Sự đặt cạnh nhau để đối chiếu",
        "synonyms": [
          "contrast",
          "comparison"
        ],
        "example": "The juxtaposition of two very different cultures."
      },
      {
        "word": "kindle",
        "pos": "verb",
        "phonetic": "/ˈkɪn.dəl/",
        "translation": "Đốt lên, nhen nhóm cảm xúc",
        "synonyms": [
          "ignite",
          "arouse"
        ],
        "example": "Her imagination was kindled by the story."
      },
      {
        "word": "kudos",
        "pos": "noun",
        "phonetic": "/ˈkjuː.dɒs/",
        "translation": "Danh tiếng, lời khen ngợi",
        "synonyms": [
          "praise",
          "prestige"
        ],
        "example": "He received much kudos for his work."
      },
      {
        "word": "lament",
        "pos": "verb",
        "phonetic": "/ləˈment/",
        "translation": "Than vãn, xót xa",
        "synonyms": [
          "mourn",
          "bewail"
        ],
        "example": "He lamented his students' lack of interest."
      },
      {
        "word": "lampoon",
        "pos": "verb",
        "phonetic": "/læmˈpuːn/",
        "translation": "Châm biếm, đả kích",
        "synonyms": [
          "satirize",
          "mock"
        ],
        "example": "The politician was frequently lampooned in the press."
      },
      {
        "word": "lassitude",
        "pos": "noun",
        "phonetic": "/ˈlæs.ɪ.tʃuːd/",
        "translation": "Sự uể oải, mệt mỏi",
        "synonyms": [
          "lethargy",
          "fatigue"
        ],
        "example": "Blaming the company's problems on the lassitude of the CEO."
      },
      {
        "word": "legitimate",
        "pos": "adjective",
        "phonetic": "/lɪˈdʒɪt.ə.mət/",
        "translation": "Hợp pháp, chính đáng",
        "synonyms": [
          "valid",
          "lawful"
        ],
        "example": "He has a legitimate claim to the property."
      },
      {
        "word": "lionize",
        "pos": "verb",
        "phonetic": "/ˈlaɪ.ə.naɪz/",
        "translation": "Tôn sùng, đối xử như VIP",
        "synonyms": [
          "glorify",
          "exalt"
        ],
        "example": "Modern athletes are lionized by the media."
      },
      {
        "word": "loathe",
        "pos": "verb",
        "phonetic": "/ləʊð/",
        "translation": "Kinh tởm, ghét cay ghét đắng",
        "synonyms": [
          "abominate",
          "detest"
        ],
        "example": "From an early age the brothers have loathed each other."
      },
      {
        "word": "lugubrious",
        "pos": "adjective",
        "phonetic": "/lʊˈɡuː.bri.əs/",
        "translation": "Sầu thảm, bi ai",
        "synonyms": [
          "mournful",
          "gloomy"
        ],
        "example": "A lugubrious face."
      },
      {
        "word": "luminous",
        "pos": "adjective",
        "phonetic": "/ˈluː.mɪ.nəs/",
        "translation": "Tỏa sáng, sáng chói",
        "synonyms": [
          "radiant",
          "bright"
        ],
        "example": "The library was filled with luminous natural light."
      },
      {
        "word": "lurid",
        "pos": "adjective",
        "phonetic": "/ˈlʊə.rɪd/",
        "translation": "Lòe loẹt, rùng rợn",
        "synonyms": [
          "gruesome",
          "sensational"
        ],
        "example": "You can read all the lurid details of the affair."
      },
      {
        "word": "magnate",
        "pos": "noun",
        "phonetic": "/ˈmæɡ.neɪt/",
        "translation": "Tài phiệt, người quyền uy",
        "synonyms": [
          "tycoon",
          "mogul"
        ],
        "example": "A well-known shipping magnate."
      },
      {
        "word": "maladroit",
        "pos": "adjective",
        "phonetic": "/ˌmæl.əˈdrɔɪt/",
        "translation": "Vụng về, không khéo léo",
        "synonyms": [
          "clumsy",
          "awkward"
        ],
        "example": "She can be a little maladroit in social situations."
      },
      {
        "word": "malaise",
        "pos": "noun",
        "phonetic": "/mælˈeɪz/",
        "translation": "Sự khó ở, phiền muộn chung",
        "synonyms": [
          "unease",
          "depression"
        ],
        "example": "A symptom of a deeper malaise in society."
      },
      {
        "word": "malinger",
        "pos": "verb",
        "phonetic": "/məˈlɪŋ.ɡər/",
        "translation": "Giả ốm để trốn việc",
        "synonyms": [
          "shirk",
          "fake illness"
        ],
        "example": "Is he really ill or just malingering?"
      },
      {
        "word": "marginal",
        "pos": "adjective",
        "phonetic": "/ˈmɑː.dʒɪ.nəl/",
        "translation": "Lề, không quan trọng, phụ",
        "synonyms": [
          "insignificant",
          "minimal"
        ],
        "example": "There has only been a marginal improvement."
      },
      {
        "word": "maverick",
        "pos": "noun",
        "phonetic": "/ˈmæv.ər.ɪk/",
        "translation": "Người độc lập, không theo khuôn mẫu",
        "synonyms": [
          "nonconformist",
          "rebel"
        ],
        "example": "He was considered a maverick in the publishing world."
      },
      {
        "word": "maudlin",
        "pos": "adjective",
        "phonetic": "/ˈmɔːd.lɪn/",
        "translation": "Ủy mị, sướt mướt",
        "synonyms": [
          "sentimental",
          "weepy"
        ],
        "example": "He gets very maudlin after a few drinks."
      },
      {
        "word": "mellifluous",
        "pos": "adjective",
        "phonetic": "/melˈɪf.lu.əs/",
        "translation": "Ngọt ngào, êm tai",
        "synonyms": [
          "dulcet",
          "harmonious"
        ],
        "example": "A deep mellifluous voice."
      },
      {
        "word": "mendacious",
        "pos": "adjective",
        "phonetic": "/menˈdeɪ.ʃəs/",
        "translation": "Sai sự thật, dối trá",
        "synonyms": [
          "lying",
          "untruthful"
        ],
        "example": "Some of these statements are downright mendacious."
      },
      {
        "word": "mercenary",
        "pos": "adjective",
        "phonetic": "/ˈmɜː.sɪ.nər.i/",
        "translation": "Hám lợi, vụ lợi",
        "synonyms": [
          "greedy",
          "avaricious"
        ],
        "example": "A mercenary scheme to marry a wealthy widow."
      },
      {
        "word": "mercurial",
        "pos": "adjective",
        "phonetic": "/mɜːˈkjʊə.ri.əl/",
        "translation": "Thay đổi nhanh chóng cảm xúc",
        "synonyms": [
          "volatile",
          "erratic"
        ],
        "example": "She was entertaining but unpredictable, with mercurial mood swings."
      },
      {
        "word": "misnomer",
        "pos": "noun",
        "phonetic": "/ˌmɪsˈnəʊ.mər/",
        "translation": "Sự nhầm tên, gọi sai tên",
        "synonyms": [
          "wrong name",
          "inaccuracy"
        ],
        "example": "\"Grand Hotel\" was a complete misnomer."
      },
      {
        "word": "modicum",
        "pos": "noun",
        "phonetic": "/ˈmɒd.ɪ.kəm/",
        "translation": "Một lượng nhỏ",
        "synonyms": [
          "ounce",
          "fragment"
        ],
        "example": "Anyone with a modicum of common sense could have seen that."
      },
      {
        "word": "moribund",
        "pos": "adjective",
        "phonetic": "/ˈmɒr.ɪ.bʌnd/",
        "translation": "Hấp hối, sắp lụi tàn",
        "synonyms": [
          "dying",
          "declining"
        ],
        "example": "Reviving the department from its present moribund state."
      },
      {
        "word": "munificent",
        "pos": "adjective",
        "phonetic": "/mjuːˈnɪf.ɪ.sənt/",
        "translation": "Rất hào phóng",
        "synonyms": [
          "generous",
          "bountiful"
        ],
        "example": "He donated a munificent sum of money to the college."
      },
      {
        "word": "myriad",
        "pos": "noun",
        "phonetic": "/ˈmɪr.i.əd/",
        "translation": "Vô số, hàng vạn",
        "synonyms": [
          "multitude",
          "countless"
        ],
        "example": "Myriads of bars are opening up along the coast."
      },
      {
        "word": "nadir",
        "pos": "noun",
        "phonetic": "/ˈneɪ.dɪər/",
        "translation": "Đáy, điểm thấp nhất",
        "synonyms": [
          "lowest point",
          "bottom"
        ],
        "example": "The defeat was the nadir of her career."
      },
      {
        "word": "nebulous",
        "pos": "adjective",
        "phonetic": "/ˈneb.jə.ləs/",
        "translation": "Mơ hồ, mờ nhạt",
        "synonyms": [
          "vague",
          "hazy"
        ],
        "example": "She has nebulous ideas about her future."
      },
      {
        "word": "neophyte",
        "pos": "noun",
        "phonetic": "/ˈniː.ə.faɪt/",
        "translation": "Người mới bắt đầu, lính mới",
        "synonyms": [
          "beginner",
          "novice"
        ],
        "example": "This computer course is for neophytes."
      },
      {
        "word": "nostalgia",
        "pos": "noun",
        "phonetic": "/nɒsˈtæl.dʒə/",
        "translation": "Sự hoài niệm, nỗi nhớ nhà",
        "synonyms": [
          "longing",
          "reminiscence"
        ],
        "example": "Hearing that song again filled him with nostalgia."
      },
      {
        "word": "noxious",
        "pos": "adjective",
        "phonetic": "/ˈnɒk.ʃəs/",
        "translation": "Độc hại, gây hại",
        "synonyms": [
          "toxic",
          "poisonous"
        ],
        "example": "They died from inhaling noxious gases."
      },
      {
        "word": "oblique",
        "pos": "adjective",
        "phonetic": "/əˈbliːk/",
        "translation": "Xiên, vòng vo",
        "synonyms": [
          "indirect",
          "slanted"
        ],
        "example": "He gave her an oblique glance."
      },
      {
        "word": "obliterate",
        "pos": "verb",
        "phonetic": "/əˈblɪt.ə.reɪt/",
        "translation": "Phá hủy hoàn toàn, xóa sạch",
        "synonyms": [
          "destroy",
          "wipe out"
        ],
        "example": "The target was totally obliterated."
      },
      {
        "word": "obscure",
        "pos": "adjective",
        "phonetic": "/əbˈskjʊər/",
        "translation": "Khó hiểu, vô danh",
        "synonyms": [
          "unclear",
          "hidden"
        ],
        "example": "His answers were obscure and confusing."
      },
      {
        "word": "obsolete",
        "pos": "adjective",
        "phonetic": "/ˌɒb.səlˈiːt/",
        "translation": "Lỗi thời, không còn sử dụng",
        "synonyms": [
          "outdated",
          "archaic"
        ],
        "example": "Gas lamps became obsolete when electric lighting was invented."
      },
      {
        "word": "obtuse",
        "pos": "adjective",
        "phonetic": "/əbˈtʃuːs/",
        "translation": "Chậm tiêu, đần độn, cùn",
        "synonyms": [
          "stupid",
          "dull"
        ],
        "example": "The answer's obvious - or are you being deliberately obtuse?"
      },
      {
        "word": "officious",
        "pos": "adjective",
        "phonetic": "/əˈfɪʃ.əs/",
        "translation": "Lăng xăng, hay can thiệp thái quá",
        "synonyms": [
          "meddlesome",
          "bossy"
        ],
        "example": "He's an officious little man and widely disliked."
      },
      {
        "word": "onerous",
        "pos": "adjective",
        "phonetic": "/ˈɒn.ər.əs/",
        "translation": "Nặng nề, nhọc nhằn",
        "synonyms": [
          "burdensome",
          "oppressive"
        ],
        "example": "The onerous task of finding a peaceful solution."
      },
      {
        "word": "opulent",
        "pos": "adjective",
        "phonetic": "/ˈɒp.jə.lənt/",
        "translation": "Xa hoa, tráng lệ, giàu có",
        "synonyms": [
          "luxurious",
          "lavish"
        ],
        "example": "An opulent lifestyle."
      },
      {
        "word": "orthodox",
        "pos": "adjective",
        "phonetic": "/ˈɔː.θə.dɒks/",
        "translation": "Chính thống, truyền thống",
        "synonyms": [
          "conventional",
          "traditional"
        ],
        "example": "We prefer a more orthodox approach."
      },
      {
        "word": "oscillate",
        "pos": "verb",
        "phonetic": "/ˈɒs.ɪ.leɪt/",
        "translation": "Dao động, lúc lắc",
        "synonyms": [
          "fluctuate",
          "swing"
        ],
        "example": "The compass needle oscillated wildly."
      },
      {
        "word": "ostensible",
        "pos": "adjective",
        "phonetic": "/ɒsˈten.sə.bəl/",
        "translation": "Bề ngoài, có vẻ là",
        "synonyms": [
          "apparent",
          "outward"
        ],
        "example": "Their ostensible goal was to clean up government corruption."
      },
      {
        "word": "pacify",
        "pos": "verb",
        "phonetic": "/ˈpæs.ɪ.faɪ/",
        "translation": "Làm yên, dẹp yên",
        "synonyms": [
          "appease",
          "soothe"
        ],
        "example": "He had to pacify angry spectators."
      },
      {
        "word": "painstaking",
        "pos": "adjective",
        "phonetic": "/ˈpeɪnzˌteɪ.kɪŋ/",
        "translation": "Chịu khó, cực kỳ cẩn thận",
        "synonyms": [
          "meticulous",
          "thorough"
        ],
        "example": "It took months of painstaking research to write the book."
      },
      {
        "word": "palliate",
        "pos": "verb",
        "phonetic": "/ˈpæl.i.eɪt/",
        "translation": "Làm giảm bớt, xoa dịu",
        "synonyms": [
          "alleviate",
          "mitigate"
        ],
        "example": "They tried to palliate the hardship of their lives."
      },
      {
        "word": "paradox",
        "pos": "noun",
        "phonetic": "/ˈpær.ə.dɒks/",
        "translation": "Nghịch lý",
        "synonyms": [
          "contradiction",
          "puzzle"
        ],
        "example": "It's a paradox that drinking a lot of water can often make you feel thirsty."
      },
      {
        "word": "paragon",
        "pos": "noun",
        "phonetic": "/ˈpær.ə.ɡɒn/",
        "translation": "Mẫu mực, hình mẫu hoàn hảo",
        "synonyms": [
          "model",
          "ideal"
        ],
        "example": "Machiavelli is presented as a paragon of virtue."
      },
      {
        "word": "pariah",
        "pos": "noun",
        "phonetic": "/pəˈraɪ.ə/",
        "translation": "Kẻ bị xã hội ruồng bỏ",
        "synonyms": [
          "outcast",
          "exile"
        ],
        "example": "The country was treated as a pariah by other nations."
      },
      {
        "word": "parochial",
        "pos": "adjective",
        "phonetic": "/pəˈrəʊ.ki.əl/",
        "translation": "Thiển cận, mang tính địa phương nhỏ hẹp",
        "synonyms": [
          "narrow-minded",
          "provincial"
        ],
        "example": "They need to look outside their parochial interests."
      },
      {
        "word": "parsimonious",
        "pos": "adjective",
        "phonetic": "/ˌpɑː.sɪˈməʊ.ni.əs/",
        "translation": "Keo kiệt, bủn xỉn",
        "synonyms": [
          "stingy",
          "frugal"
        ],
        "example": "She's too parsimonious to heat the house properly."
      },
      {
        "word": "partisan",
        "pos": "adjective",
        "phonetic": "/ˌpɑː.tɪˈzæn/",
        "translation": "Thiên vị, mù quáng ủng hộ một phe",
        "synonyms": [
          "biased",
          "prejudiced"
        ],
        "example": "The audience was very partisan."
      },
      {
        "word": "pathos",
        "pos": "noun",
        "phonetic": "/ˈpeɪ.θɒs/",
        "translation": "Sự khơi gợi niềm xót xa, bi ai",
        "synonyms": [
          "tragedy",
          "sadness"
        ],
        "example": "There's a pathos in his performance."
      },
      {
        "word": "paucity",
        "pos": "noun",
        "phonetic": "/ˈpɔː.sə.ti/",
        "translation": "Sự khan hiếm, thiếu thốn",
        "synonyms": [
          "scarcity",
          "dearth"
        ],
        "example": "A paucity of information on the ingredients."
      },
      {
        "word": "pedantic",
        "pos": "adjective",
        "phonetic": "/pəˈdæn.tɪk/",
        "translation": "Quá chú trọng tiểu tiết học thuật",
        "synonyms": [
          "fussy",
          "exact"
        ],
        "example": "They were being unnecessarily pedantic."
      },
      {
        "word": "pejorative",
        "pos": "adjective",
        "phonetic": "/pɪˈdʒɒr.ə.tɪv/",
        "translation": "Có tính miệt thị, chê bai",
        "synonyms": [
          "derogatory",
          "negative"
        ],
        "example": "Make sure students realize that \"fat\" is a pejorative word."
      },
      {
        "word": "penchant",
        "pos": "noun",
        "phonetic": "/ˈpɒ̃.ʃɒ̃/",
        "translation": "Sở thích mạnh mẽ, thiên hướng",
        "synonyms": [
          "inclination",
          "fondness"
        ],
        "example": "He has a penchant for adopting stray dogs."
      },
      {
        "word": "penury",
        "pos": "noun",
        "phonetic": "/ˈpen.jʊ.ri/",
        "translation": "Sự túng quẫn, nghèo xơ xác",
        "synonyms": [
          "poverty",
          "destitution"
        ],
        "example": "He died in penury in 1650."
      },
      {
        "word": "perfidious",
        "pos": "adjective",
        "phonetic": "/pəˈfɪd.i.əs/",
        "translation": "Bội bạc, phản trắc",
        "synonyms": [
          "treacherous",
          "deceitful"
        ],
        "example": "A perfidious attack on democracy."
      },
      {
        "word": "peripatetic",
        "pos": "adjective",
        "phonetic": "/ˌper.ɪ.pəˈtet.ɪk/",
        "translation": "Nay đây mai đó, đi lang thang",
        "synonyms": [
          "nomadic",
          "wandering"
        ],
        "example": "He had a peripatetic career as a salesman."
      },
      {
        "word": "peripheral",
        "pos": "adjective",
        "phonetic": "/pəˈrɪf.ər.əl/",
        "translation": "Thuộc ngoại vi, không quan trọng lắm",
        "synonyms": [
          "marginal",
          "secondary"
        ],
        "example": "The book contains a great deal of peripheral detail."
      },
      {
        "word": "permeate",
        "pos": "verb",
        "phonetic": "/ˈpɜː.mi.eɪt/",
        "translation": "Thấm vào, tỏa khắp",
        "synonyms": [
          "pervade",
          "saturate"
        ],
        "example": "Dissatisfaction has permeated every section of society."
      },
      {
        "word": "pervasive",
        "pos": "adjective",
        "phonetic": "/pəˈveɪ.sɪv/",
        "translation": "Lan tỏa, phổ biến khắp nơi",
        "synonyms": [
          "widespread",
          "ubiquitous"
        ],
        "example": "The influence of Freud is pervasive in her books."
      },
      {
        "word": "petulant",
        "pos": "adjective",
        "phonetic": "/ˈpetʃ.ə.lənt/",
        "translation": "Cáu kỉnh, hờn dỗi",
        "synonyms": [
          "peevish",
          "cranky"
        ],
        "example": "He played the part of a spoiled, petulant child."
      },
      {
        "word": "phlegmatic",
        "pos": "adjective",
        "phonetic": "/fleɡˈmæt.ɪk/",
        "translation": "Lạnh lùng, thản nhiên",
        "synonyms": [
          "calm",
          "composed"
        ],
        "example": "His great asset was his calm, phlegmatic manner."
      },
      {
        "word": "pithy",
        "pos": "adjective",
        "phonetic": "/ˈpɪθ.i/",
        "translation": "Súc tích, có ý nghĩa sâu sắc",
        "synonyms": [
          "concise",
          "succinct"
        ],
        "example": "A pithy remark."
      },
      {
        "word": "placid",
        "pos": "adjective",
        "phonetic": "/ˈplæs.ɪd/",
        "translation": "Bình yên, tĩnh lặng",
        "synonyms": [
          "calm",
          "tranquil"
        ],
        "example": "The placid pace of village life."
      },
      {
        "word": "platitude",
        "pos": "noun",
        "phonetic": "/ˈplæt.ɪ.tʃuːd/",
        "translation": "Lời nói vô vị, sáo rỗng",
        "synonyms": [
          "cliché",
          "truism"
        ],
        "example": "They nodded at every platitude."
      },
      {
        "word": "plethora",
        "pos": "noun",
        "phonetic": "/ˈpleθ.ər.ə/",
        "translation": "Sự thừa thãi, quá nhiều",
        "synonyms": [
          "excess",
          "abundance"
        ],
        "example": "There's a plethora of books about the royal family."
      },
      {
        "word": "poignant",
        "pos": "adjective",
        "phonetic": "/ˈpɔɪ.njənt/",
        "translation": "Chua xót, làm mủi lòng",
        "synonyms": [
          "moving",
          "touching"
        ],
        "example": "The photograph awakens poignant memories."
      },
      {
        "word": "polarize",
        "pos": "verb",
        "phonetic": "/ˈpəʊ.lə.raɪz/",
        "translation": "Phân cực, chia rẽ hoàn toàn",
        "synonyms": [
          "divide",
          "separate"
        ],
        "example": "The debate is becoming polarized."
      },
      {
        "word": "ponderous",
        "pos": "adjective",
        "phonetic": "/ˈpɒn.dər.əs/",
        "translation": "Nặng nề, lạch bạch, chán ngắt",
        "synonyms": [
          "heavy",
          "clumsy"
        ],
        "example": "He had a slow and ponderous manner."
      },
      {
        "word": "portent",
        "pos": "noun",
        "phonetic": "/ˈpɔː.tent/",
        "translation": "Điềm báo xấu",
        "synonyms": [
          "omen",
          "sign"
        ],
        "example": "For the economy, the portents are extremely gloomy."
      },
      {
        "word": "precarious",
        "pos": "adjective",
        "phonetic": "/prɪˈkeə.ri.əs/",
        "translation": "Bấp bênh, nguy hiểm",
        "synonyms": [
          "insecure",
          "risky"
        ],
        "example": "Caught in a precarious financial position."
      },
      {
        "word": "precedent",
        "pos": "noun",
        "phonetic": "/ˈpres.ɪ.dənt/",
        "translation": "Tiền lệ",
        "synonyms": [
          "example",
          "model"
        ],
        "example": "There are several precedents for promoting people without qualifications."
      },
      {
        "word": "preclude",
        "pos": "verb",
        "phonetic": "/prɪˈkluːd/",
        "translation": "Ngăn cản, làm cho không thể xảy ra",
        "synonyms": [
          "prevent",
          "prohibit"
        ],
        "example": "His contract precludes him from discussing his work."
      },
      {
        "word": "precursor",
        "pos": "noun",
        "phonetic": "/prɪˈkɜː.sər/",
        "translation": "Tiền thân, người/vật đi trước",
        "synonyms": [
          "forerunner",
          "predecessor"
        ],
        "example": "Biological research is a precursor to medical breakthroughs."
      },
      {
        "word": "predilection",
        "pos": "noun",
        "phonetic": "/ˌpriː.dɪˈlek.ʃən/",
        "translation": "Sự ưa chuộng, thiên vị",
        "synonyms": [
          "preference",
          "fondness"
        ],
        "example": "She has had a predilection for spicy food."
      },
      {
        "word": "prerogative",
        "pos": "noun",
        "phonetic": "/prɪˈrɒɡ.ə.tɪv/",
        "translation": "Đặc quyền",
        "synonyms": [
          "privilege",
          "right"
        ],
        "example": "Alex makes all the big decisions - that's his prerogative."
      },
      {
        "word": "presage",
        "pos": "verb",
        "phonetic": "/ˈpres.ɪdʒ/",
        "translation": "Báo trước, dự báo",
        "synonyms": [
          "foreshadow",
          "predict"
        ],
        "example": "Excesses that normally presage a recession."
      },
      {
        "word": "prescient",
        "pos": "adjective",
        "phonetic": "/ˈpres.i.ənt/",
        "translation": "Biết trước, có tầm nhìn xa",
        "synonyms": [
          "prophetic",
          "visionary"
        ],
        "example": "A prescient warning."
      },
      {
        "word": "presumptuous",
        "pos": "adjective",
        "phonetic": "/prɪˈzʌmp.tʃu.əs/",
        "translation": "Quá tự tin, tự phụ, thô lỗ",
        "synonyms": [
          "arrogant",
          "forward"
        ],
        "example": "It would be presumptuous of me to comment."
      },
      {
        "word": "prevalent",
        "pos": "adjective",
        "phonetic": "/ˈprev.əl.ənt/",
        "translation": "Thịnh hành, phổ biến",
        "synonyms": [
          "widespread",
          "common"
        ],
        "example": "These diseases are prevalent among children."
      },
      {
        "word": "pristine",
        "pos": "adjective",
        "phonetic": "/ˈprɪs.tiːn/",
        "translation": "Nguyên sơ, sạch sẽ hoàn hảo",
        "synonyms": [
          "unspoiled",
          "immaculte"
        ],
        "example": "Only two months old and in pristine condition."
      },
      {
        "word": "probity",
        "pos": "noun",
        "phonetic": "/ˈprəʊ.bə.ti/",
        "translation": "Sự thanh liêm, chính trực",
        "synonyms": [
          "honesty",
          "morality"
        ],
        "example": "Her probity and integrity are beyond question."
      },
      {
        "word": "proclivity",
        "pos": "noun",
        "phonetic": "/prəˈklɪv.ə.ti/",
        "translation": "Thiên hướng thói hư",
        "synonyms": [
          "inclination",
          "tendency"
        ],
        "example": "The sexual proclivities of celebrities."
      },
      {
        "word": "prodigal",
        "pos": "adjective",
        "phonetic": "/ˈprɒd.ɪ.ɡəl/",
        "translation": "Hoang phí, tiêu tiền như nước",
        "synonyms": [
          "extravagant",
          "wasteful"
        ],
        "example": "The prodigal landlord spends the money fast."
      },
      {
        "word": "prodigious",
        "pos": "adjective",
        "phonetic": "/prəˈdɪdʒ.əs/",
        "translation": "Phi thường, to lớn",
        "synonyms": [
          "enormous",
          "colossal"
        ],
        "example": "She wrote a prodigious number of novels."
      },
      {
        "word": "profane",
        "pos": "adjective",
        "phonetic": "/prəˈfeɪn/",
        "translation": "Phàm tục, báng bổ",
        "synonyms": [
          "secular",
          "sacrilegious"
        ],
        "example": "Profane language."
      },
      {
        "word": "profligate",
        "pos": "adjective",
        "phonetic": "/ˈprɒf.lɪ.ɡət/",
        "translation": "Phóng đãng, hoang phí",
        "synonyms": [
          "wasteful",
          "degenerate"
        ],
        "example": "She is well-known for her profligate spending habits."
      },
      {
        "word": "profound",
        "pos": "adjective",
        "phonetic": "/prəˈfaʊnd/",
        "translation": "Sâu sắc, uyên thâm",
        "synonyms": [
          "deep",
          "insightful"
        ],
        "example": "His mother's death had a profound effect on him."
      },
      {
        "word": "profuse",
        "pos": "adjective",
        "phonetic": "/prəˈfjuːs/",
        "translation": "Dồi dào, tuôn trào",
        "synonyms": [
          "abundant",
          "copious"
        ],
        "example": "She was admitted with profuse bleeding."
      },
      {
        "word": "proliferate",
        "pos": "verb",
        "phonetic": "/prəˈlɪf.ər.eɪt/",
        "translation": "Sinh sôi nảy nở, tăng nhanh",
        "synonyms": [
          "multiply",
          "mushroom"
        ],
        "example": "Small businesses have proliferated in the last ten years."
      },
      {
        "word": "propensity",
        "pos": "noun",
        "phonetic": "/prəˈpen.sə.ti/",
        "translation": "Xu hướng, thiên hướng tự nhiên",
        "synonyms": [
          "tendency",
          "inclination"
        ],
        "example": "Inherited a propensity to talk too much."
      },
      {
        "word": "propitious",
        "pos": "adjective",
        "phonetic": "/prəˈpɪʃ.əs/",
        "translation": "Thuận lợi, mang điềm lành",
        "synonyms": [
          "favorable",
          "auspicious"
        ],
        "example": "It was not a propitious time to start a company."
      },
      {
        "word": "proscribe",
        "pos": "verb",
        "phonetic": "/prəʊˈskraɪb/",
        "translation": "Cấm, bài trừ",
        "synonyms": [
          "prohibit",
          "ban"
        ],
        "example": "The runner was banned for using proscribed drugs."
      },
      {
        "word": "proselytize",
        "pos": "verb",
        "phonetic": "/ˈprɒs.ə.lɪ.taɪz/",
        "translation": "Cố gắng thuyết phục ai cải đạo",
        "synonyms": [
          "convert",
          "evangelize"
        ],
        "example": "Television provides a platform for proselytizing."
      },
      {
        "word": "provincial",
        "pos": "adjective",
        "phonetic": "/prəˈvɪn.ʃəl/",
        "translation": "Quê mùa, thiển cận",
        "synonyms": [
          "narrow-minded",
          "parochial"
        ],
        "example": "Provincial attitudes."
      },
      {
        "word": "provocative",
        "pos": "adjective",
        "phonetic": "/prəˈvɒk.ə.tɪv/",
        "translation": "Khiêu khích, trêu chọc",
        "synonyms": [
          "inciting",
          "stimulating"
        ],
        "example": "In a deliberately provocative speech, she criticized the system."
      },
      {
        "word": "proximity",
        "pos": "noun",
        "phonetic": "/prɒkˈsɪm.ə.ti/",
        "translation": "Sự gần gũi",
        "synonyms": [
          "closeness",
          "nearness"
        ],
        "example": "The best thing is its proximity to the town centre."
      },
      {
        "word": "punctilious",
        "pos": "adjective",
        "phonetic": "/pʌŋkˈtɪl.i.əs/",
        "translation": "Cực kỳ tỉ mỉ, câu nệ",
        "synonyms": [
          "meticulous",
          "fastidious"
        ],
        "example": "He was always punctilious in his manners."
      },
      {
        "word": "pundit",
        "pos": "noun",
        "phonetic": "/ˈpʌn.dɪt/",
        "translation": "Chuyên gia, học giả bình luận",
        "synonyms": [
          "expert",
          "authority"
        ],
        "example": "A political pundit."
      },
      {
        "word": "pungent",
        "pos": "adjective",
        "phonetic": "/ˈpʌn.dʒənt/",
        "translation": "Hăng, cay nồng, sắc sảo",
        "synonyms": [
          "strong",
          "sharp"
        ],
        "example": "The pungent whiff of a goat."
      },
      {
        "word": "putative",
        "pos": "adjective",
        "phonetic": "/ˈpjuː.tə.tɪv/",
        "translation": "Được cho là, được giả định là",
        "synonyms": [
          "supposed",
          "presumed"
        ],
        "example": "The putative leader of the terrorist cell was arrested."
      },
      {
        "word": "quagmire",
        "pos": "noun",
        "phonetic": "/ˈkwɒɡ.maɪər/",
        "translation": "Vũng lầy, tiến thoái lưỡng nan",
        "synonyms": [
          "swamp",
          "dilemma"
        ],
        "example": "The country has sunk into a quagmire of violence."
      },
      {
        "word": "quaint",
        "pos": "adjective",
        "phonetic": "/kweɪnt/",
        "translation": "Kỳ lạ nhưng cổ kính",
        "synonyms": [
          "charming",
          "picturesque"
        ],
        "example": "A quaint old cottage."
      },
      {
        "word": "quandary",
        "pos": "noun",
        "phonetic": "/ˈkwɒn.də.ri/",
        "translation": "Tình thế bối rối",
        "synonyms": [
          "dilemma",
          "predicament"
        ],
        "example": "I'm in a real quandary about which one to accept."
      },
      {
        "word": "quell",
        "pos": "verb",
        "phonetic": "/kwel/",
        "translation": "Dập tắt, đàn áp",
        "synonyms": [
          "suppress",
          "subdue"
        ],
        "example": "Police were called in to quell the disturbances."
      },
      {
        "word": "quotidian",
        "pos": "adjective",
        "phonetic": "/kwəʊˈtɪd.i.ən/",
        "translation": "Hằng ngày, tầm thường",
        "synonyms": [
          "daily",
          "ordinary"
        ],
        "example": "Television has become part of our quotidian existence."
      },
      {
        "word": "ramification",
        "pos": "noun",
        "phonetic": "/ˌræm.ɪ.fɪˈkeɪ.ʃən/",
        "translation": "Hậu quả",
        "synonyms": [
          "consequence",
          "result"
        ],
        "example": "Have you considered all the ramifications of your suggestion?"
      },
      {
        "word": "rapacious",
        "pos": "adjective",
        "phonetic": "/rəˈpeɪ.ʃəs/",
        "translation": "Tham lam, bóc lột",
        "synonyms": [
          "greedy",
          "predatory"
        ],
        "example": "Her real estate agent was ruthless and rapacious."
      },
      {
        "word": "raze",
        "pos": "verb",
        "phonetic": "/reɪz/",
        "translation": "San phẳng, phá trụi",
        "synonyms": [
          "destroy",
          "demolish"
        ],
        "example": "The town was razed to the ground in the bombing raid."
      },
      {
        "word": "rebut",
        "pos": "verb",
        "phonetic": "/rɪˈbʌt/",
        "translation": "Bác bỏ bằng lý lẽ",
        "synonyms": [
          "refute",
          "disprove"
        ],
        "example": "She rebutted charges of financial malpractice."
      },
      {
        "word": "recalcitrant",
        "pos": "adjective",
        "phonetic": "/rɪˈkæl.sɪ.trənt/",
        "translation": "Ngoan cố, chống đối",
        "synonyms": [
          "stubborn",
          "obstinate"
        ],
        "example": "Tenants petitioned their recalcitrant landlord."
      },
      {
        "word": "recant",
        "pos": "verb",
        "phonetic": "/rɪˈkænt/",
        "translation": "Rút lại lời nói/niềm tin",
        "synonyms": [
          "retract",
          "renounce"
        ],
        "example": "He publicly recanted his views."
      },
      {
        "word": "redoubtable",
        "pos": "adjective",
        "phonetic": "/rɪˈdaʊ.tə.bəl/",
        "translation": "Đáng gờm, đáng nể",
        "synonyms": [
          "formidable",
          "fearsome"
        ],
        "example": "He faces the most redoubtable opponent of his career."
      },
      {
        "word": "redundant",
        "pos": "adjective",
        "phonetic": "/rɪˈdʌn.dənt/",
        "translation": "Dư thừa, không cần thiết",
        "synonyms": [
          "unnecessary",
          "superfluous"
        ],
        "example": "In \"single unmarried woman\", \"unmarried\" is redundant."
      },
      {
        "word": "refute",
        "pos": "verb",
        "phonetic": "/rɪˈfjuːt/",
        "translation": "Bẻ lại, chứng minh là sai",
        "synonyms": [
          "disprove",
          "rebut"
        ],
        "example": "To refute a theory."
      },
      {
        "word": "relegate",
        "pos": "verb",
        "phonetic": "/ˈrel.ɪ.ɡeɪt/",
        "translation": "Giáng chức, đày ải",
        "synonyms": [
          "demote",
          "downgrade"
        ],
        "example": "She resigned when she was relegated to a desk job."
      },
      {
        "word": "relinquish",
        "pos": "verb",
        "phonetic": "/rɪˈlɪŋ.kwɪʃ/",
        "translation": "Buông bỏ, nhường lại",
        "synonyms": [
          "surrender",
          "give up"
        ],
        "example": "He has relinquished his claim to the throne."
      },
      {
        "word": "remonstrate",
        "pos": "verb",
        "phonetic": "/ˈrem.ən.streɪt/",
        "translation": "Khiển trách, phản đối kịch liệt",
        "synonyms": [
          "protest",
          "argue"
        ],
        "example": "I went to the boss to remonstrate against the new rules."
      },
      {
        "word": "renegade",
        "pos": "noun",
        "phonetic": "/ˈren.ɪ.ɡeɪd/",
        "translation": "Kẻ phản đạo, kẻ phản tặc",
        "synonyms": [
          "traitor",
          "rebel"
        ],
        "example": "A band of renegades had captured the prince."
      },
      {
        "word": "replete",
        "pos": "adjective",
        "phonetic": "/rɪˈpliːt/",
        "translation": "Đầy đủ, no nê",
        "synonyms": [
          "full",
          "filled"
        ],
        "example": "This car has an engine replete with the latest technology."
      },
      {
        "word": "reprehensible",
        "pos": "adjective",
        "phonetic": "/ˌrep.rɪˈhen.sə.bəl/",
        "translation": "Đáng bị khiển trách",
        "synonyms": [
          "blameworthy",
          "culpable"
        ],
        "example": "Reprehensible conduct."
      },
      {
        "word": "reprove",
        "pos": "verb",
        "phonetic": "/rɪˈpruːv/",
        "translation": "Mắng mỏ, quở trách",
        "synonyms": [
          "scold",
          "reprimand"
        ],
        "example": "The teacher gently reproved the boys for not paying attention."
      },
      {
        "word": "requisite",
        "pos": "adjective",
        "phonetic": "/ˈrek.wɪ.zɪt/",
        "translation": "Điều kiện tất yếu, cần thiết",
        "synonyms": [
          "necessary",
          "required"
        ],
        "example": "He lacked the requisite skills for the job."
      },
      {
        "word": "resolute",
        "pos": "adjective",
        "phonetic": "/ˈrez.ə.luːt/",
        "translation": "Kiên quyết, quả quyết",
        "synonyms": [
          "determined",
          "unwavering"
        ],
        "example": "Their resolute opposition was difficult to overcome."
      },
      {
        "word": "respite",
        "pos": "noun",
        "phonetic": "/ˈres.paɪt/",
        "translation": "Khoảng thời gian nghỉ ngơi",
        "synonyms": [
          "break",
          "relief"
        ],
        "example": "They had a day's respite before their essays were due."
      },
      {
        "word": "retract",
        "pos": "verb",
        "phonetic": "/rɪˈtrækt/",
        "translation": "Rút lại, co lại",
        "synonyms": [
          "withdraw",
          "take back"
        ],
        "example": "He reached out his hand, but then retracted it."
      },
      {
        "word": "reverent",
        "pos": "adjective",
        "phonetic": "/ˈrev.ər.ənt/",
        "translation": "Cung kính, tôn trọng sâu sắc",
        "synonyms": [
          "respectful",
          "devout"
        ],
        "example": "A reverent silence fell over the crowd."
      },
      {
        "word": "rigorous",
        "pos": "adjective",
        "phonetic": "/ˈrɪɡ.ər.əs/",
        "translation": "Nghiêm ngặt, khắt khe",
        "synonyms": [
          "strict",
          "stringent"
        ],
        "example": "Rigorous testing methods."
      },
      {
        "word": "robust",
        "pos": "adjective",
        "phonetic": "/rəʊˈbʌst/",
        "translation": "Cường tráng, mạnh mẽ",
        "synonyms": [
          "strong",
          "vigorous"
        ],
        "example": "He looks robust and healthy enough."
      },
      {
        "word": "rudimentary",
        "pos": "adjective",
        "phonetic": "/ˌruː.dɪˈmen.tər.i/",
        "translation": "Thô sơ, cơ bản",
        "synonyms": [
          "basic",
          "elementary"
        ],
        "example": "Her knowledge is still only rudimentary."
      },
      {
        "word": "rustic",
        "pos": "adjective",
        "phonetic": "/ˈrʌs.tɪk/",
        "translation": "Thuộc nông thôn, mộc mạc",
        "synonyms": [
          "rural",
          "unpolished"
        ],
        "example": "A rustic oak table."
      },
      {
        "word": "salutary",
        "pos": "adjective",
        "phonetic": "/ˈsæl.jə.tər.i/",
        "translation": "Có lợi, bài học đắt giá",
        "synonyms": [
          "beneficial",
          "helpful"
        ],
        "example": "A salutary experience."
      },
      {
        "word": "sanctimonious",
        "pos": "adjective",
        "phonetic": "/ˌsæŋk.tɪˈməʊ.ni.əs/",
        "translation": "Ra vẻ đạo mạo",
        "synonyms": [
          "hypocritical",
          "self-righteous"
        ],
        "example": "Sanctimonious religious leaders."
      },
      {
        "word": "sanguine",
        "pos": "adjective",
        "phonetic": "/ˈsæŋ.ɡwɪn/",
        "translation": "Lạc quan, đầy hy vọng",
        "synonyms": [
          "optimistic",
          "hopeful"
        ],
        "example": "They are less sanguine about the prospects for peace."
      },
      {
        "word": "sardonic",
        "pos": "adjective",
        "phonetic": "/sɑːˈdɒn.ɪk/",
        "translation": "Nhạo báng, mỉa mai cay độc",
        "synonyms": [
          "sarcastic",
          "mocking"
        ],
        "example": "A sardonic smile."
      },
      {
        "word": "satiate",
        "pos": "verb",
        "phonetic": "/ˈseɪ.ʃi.eɪt/",
        "translation": "Làm no nê, thỏa mãn",
        "synonyms": [
          "satisfy",
          "gorge"
        ],
        "example": "He drank greedily until his thirst was satiated."
      },
      {
        "word": "scathing",
        "pos": "adjective",
        "phonetic": "/ˈskeɪ.ðɪŋ/",
        "translation": "Cay độc, gay gắt",
        "synonyms": [
          "bitter",
          "harsh"
        ],
        "example": "Scathing criticism."
      },
      {
        "word": "scrutinize",
        "pos": "verb",
        "phonetic": "/ˈskruː.tɪ.naɪz/",
        "translation": "Nhìn kỹ, xem xét tỉ mỉ",
        "synonyms": [
          "examine",
          "inspect"
        ],
        "example": "He scrutinized the men's faces carefully."
      },
      {
        "word": "sedulous",
        "pos": "adjective",
        "phonetic": "/ˈsedʒ.ə.ləs/",
        "translation": "Cần mẫn, chuyên cần",
        "synonyms": [
          "diligent",
          "assiduous"
        ],
        "example": "Students sedulous enough to read the book deserved top marks."
      },
      {
        "word": "sequester",
        "pos": "verb",
        "phonetic": "/sɪˈkwes.tər/",
        "translation": "Cô lập, để riêng ra",
        "synonyms": [
          "isolate",
          "seclude"
        ],
        "example": "The jury was sequestered until a verdict was reached."
      },
      {
        "word": "serendipity",
        "pos": "noun",
        "phonetic": "/ˌser.ənˈdɪp.ə.ti/",
        "translation": "Sự tình cờ may mắn",
        "synonyms": [
          "chance",
          "luck"
        ],
        "example": "They found each other by pure serendipity."
      },
      {
        "word": "servile",
        "pos": "adjective",
        "phonetic": "/ˈsɜː.vaɪl/",
        "translation": "Nô lệ, khúm núm",
        "synonyms": [
          "obsequious",
          "submissive"
        ],
        "example": "Be pleasant to people without appearing totally servile."
      },
      {
        "word": "singular",
        "pos": "adjective",
        "phonetic": "/ˈsɪŋ.ɡjə.lər/",
        "translation": "Kỳ lạ, xuất chúng",
        "synonyms": [
          "unique",
          "remarkable"
        ],
        "example": "It was a building of singular grace and beauty."
      },
      {
        "word": "sinister",
        "pos": "adjective",
        "phonetic": "/ˈsɪn.ɪ.stər/",
        "translation": "Nham hiểm, có điềm gở",
        "synonyms": [
          "evil",
          "ominous"
        ],
        "example": "The ruined castle looked sinister against the dark sky."
      },
      {
        "word": "skeptical",
        "pos": "adjective",
        "phonetic": "/ˈskep.tɪ.kəl/",
        "translation": "Hoài nghi, đa nghi",
        "synonyms": [
          "doubtful",
          "cynical"
        ],
        "example": "Many experts remain skeptical about his claims."
      },
      {
        "word": "sluggish",
        "pos": "adjective",
        "phonetic": "/ˈslʌɡ.ɪʃ/",
        "translation": "Chậm chạp, lờ đờ",
        "synonyms": [
          "lethargic",
          "slow"
        ],
        "example": "A heavy lunch makes me sluggish in the afternoon."
      },
      {
        "word": "solicitous",
        "pos": "adjective",
        "phonetic": "/səˈlɪs.ɪ.təs/",
        "translation": "Chu đáo, ân cần lo lắng",
        "synonyms": [
          "caring",
          "attentive"
        ],
        "example": "He made a solicitous enquiry after her health."
      },
      {
        "word": "somber",
        "pos": "adjective",
        "phonetic": "/ˈsɒm.bər/",
        "translation": "U ám, sầu thảm",
        "synonyms": [
          "gloomy",
          "dark"
        ],
        "example": "A somber atmosphere."
      },
      {
        "word": "sparse",
        "pos": "adjective",
        "phonetic": "/spɑːs/",
        "translation": "Thưa thớt, rải rác",
        "synonyms": [
          "scanty",
          "meager"
        ],
        "example": "Information coming out of the disaster area is sparse."
      },
      {
        "word": "squalid",
        "pos": "adjective",
        "phonetic": "/ˈskwɒl.ɪd/",
        "translation": "Dơ dáy, bẩn thỉu",
        "synonyms": [
          "filthy",
          "sordid"
        ],
        "example": "Many prisons are overcrowded and squalid places."
      },
      {
        "word": "squander",
        "pos": "verb",
        "phonetic": "/ˈskwɒn.dər/",
        "translation": "Phung phí",
        "synonyms": [
          "waste",
          "fritter away"
        ],
        "example": "Squander a whole year's savings on two weeks in the sun."
      },
      {
        "word": "stagnant",
        "pos": "adjective",
        "phonetic": "/ˈstæɡ.nənt/",
        "translation": "Trì trệ, ứ đọng",
        "synonyms": [
          "motionless",
          "inactive"
        ],
        "example": "A stagnant economy."
      },
      {
        "word": "static",
        "pos": "adjective",
        "phonetic": "/ˈstæt.ɪk/",
        "translation": "Tĩnh, không thay đổi",
        "synonyms": [
          "unchanging",
          "fixed"
        ],
        "example": "Oil prices have remained static for the last few months."
      },
      {
        "word": "steadfast",
        "pos": "adjective",
        "phonetic": "/ˈsted.fɑːst/",
        "translation": "Kiên định, trước sau như một",
        "synonyms": [
          "loyal",
          "unwavering"
        ],
        "example": "A steadfast friend."
      },
      {
        "word": "stigmatize",
        "pos": "verb",
        "phonetic": "/ˈstɪɡ.mə.taɪz/",
        "translation": "Kỳ thị, bôi nhọ danh dự",
        "synonyms": [
          "condemn",
          "brand"
        ],
        "example": "People should not be stigmatized on the basis of race."
      },
      {
        "word": "stolid",
        "pos": "adjective",
        "phonetic": "/ˈstɒl.ɪd/",
        "translation": "Dửng dưng, thản nhiên",
        "synonyms": [
          "impassive",
          "unemotional"
        ],
        "example": "He's a very stolid, serious man."
      },
      {
        "word": "stricture",
        "pos": "noun",
        "phonetic": "/ˈstrɪk.tʃər/",
        "translation": "Sự phê bình gắt gao, hạn chế",
        "synonyms": [
          "constraint",
          "criticism"
        ],
        "example": "The strictures of the United Nations have failed to have any effect."
      },
      {
        "word": "strident",
        "pos": "adjective",
        "phonetic": "/ˈstraɪ.dənt/",
        "translation": "Chói tai, quyết liệt",
        "synonyms": [
          "harsh",
          "loud"
        ],
        "example": "People are put off by his strident voice."
      },
      {
        "word": "stringent",
        "pos": "adjective",
        "phonetic": "/ˈstrɪn.dʒənt/",
        "translation": "Nghiêm ngặt, chặt chẽ",
        "synonyms": [
          "strict",
          "rigorous"
        ],
        "example": "The most stringent laws in the world."
      },
      {
        "word": "stymie",
        "pos": "verb",
        "phonetic": "/ˈstaɪ.mi/",
        "translation": "Cản trở, làm bế tắc",
        "synonyms": [
          "thwart",
          "hinder"
        ],
        "example": "We were stymied by the absence of any recent documents."
      },
      {
        "word": "subjugate",
        "pos": "verb",
        "phonetic": "/ˈsʌb.dʒə.ɡeɪt/",
        "translation": "Chinh phục, khuất phục",
        "synonyms": [
          "conquer",
          "suppress"
        ],
        "example": "She subjugated herself to her mother's needs."
      },
      {
        "word": "sublime",
        "pos": "adjective",
        "phonetic": "/səˈblaɪm/",
        "translation": "Tuyệt đỉnh, hùng vĩ",
        "synonyms": [
          "elevated",
          "majestic"
        ],
        "example": "Sublime beauty."
      },
      {
        "word": "subordinate",
        "pos": "adjective",
        "phonetic": "/səˈbɔː.dɪ.nət/",
        "translation": "Cấp dưới, phụ thuộc",
        "synonyms": [
          "inferior",
          "secondary"
        ],
        "example": "The individual's needs are subordinate to those of the group."
      },
      {
        "word": "substantive",
        "pos": "adjective",
        "phonetic": "/səbˈstæn.tɪv/",
        "translation": "Có thực chất, trọng đại",
        "synonyms": [
          "essential",
          "substantial"
        ],
        "example": "Substantive conclusions."
      },
      {
        "word": "subtle",
        "pos": "adjective",
        "phonetic": "/ˈsʌt.əl/",
        "translation": "Tinh tế, khó thấy",
        "synonyms": [
          "delicate",
          "elusive"
        ],
        "example": "The room was painted a subtle shade of pink."
      },
      {
        "word": "subvert",
        "pos": "verb",
        "phonetic": "/səbˈvɜːt/",
        "translation": "Lật đổ, phá vỡ ngầm",
        "synonyms": [
          "undermine",
          "overthrow"
        ],
        "example": "The rebel army is attempting to subvert the government."
      },
      {
        "word": "succinct",
        "pos": "adjective",
        "phonetic": "/səkˈsɪŋkt/",
        "translation": "Ngắn gọn, súc tích",
        "synonyms": [
          "concise",
          "brief"
        ],
        "example": "Keep your letter succinct and to the point."
      },
      {
        "word": "supercilious",
        "pos": "adjective",
        "phonetic": "/ˌsuː.pəˈsɪl.i.əs/",
        "translation": "Khinh khỉnh, kiêu ngạo",
        "synonyms": [
          "arrogant",
          "disdainful"
        ],
        "example": "He spoke in a haughty, supercilious voice."
      },
      {
        "word": "superficial",
        "pos": "adjective",
        "phonetic": "/ˌsuː.pəˈfɪʃ.əl/",
        "translation": "Hời hợt, bề ngoài, nông cạn",
        "synonyms": [
          "shallow",
          "surface"
        ],
        "example": "He's fun to be with, but he's very superficial."
      },
      {
        "word": "surfeit",
        "pos": "noun",
        "phonetic": "/ˈsɜː.fɪt/",
        "translation": "Sự quá mức, thừa mứa",
        "synonyms": [
          "excess",
          "surplus"
        ],
        "example": "The country has a surfeit of cheap labour."
      },
      {
        "word": "surmise",
        "pos": "verb",
        "phonetic": "/səˈmaɪz/",
        "translation": "Phỏng đoán, ngờ vực",
        "synonyms": [
          "guess",
          "conjecture"
        ],
        "example": "The police surmise that the robbers have fled."
      },
      {
        "word": "sybarite",
        "pos": "noun",
        "phonetic": "/ˈsɪb.ə.raɪt/",
        "translation": "Người thích hưởng thụ xa hoa",
        "synonyms": [
          "hedonist",
          "voluptuary"
        ],
        "example": "He was a sybarite who lived for pleasure."
      },
      {
        "word": "symbiosis",
        "pos": "noun",
        "phonetic": "/ˌsɪm.baɪˈəʊ.sɪs/",
        "translation": "Sự cộng sinh, phụ thuộc lẫn nhau",
        "synonyms": [
          "interdependence",
          "cooperation"
        ],
        "example": "A perfect symbiosis between the singer and the band."
      },
      {
        "word": "symmetry",
        "pos": "noun",
        "phonetic": "/ˈsɪm.ə.tri/",
        "translation": "Sự đối xứng, cân đối",
        "synonyms": [
          "balance",
          "proportion"
        ],
        "example": "The design of the house had a pleasing symmetry."
      },
      {
        "word": "synthesis",
        "pos": "noun",
        "phonetic": "/ˈsɪn.θə.sɪs/",
        "translation": "Sự tổng hợp, kết hợp",
        "synonyms": [
          "combination",
          "blend"
        ],
        "example": "His latest album is a synthesis of African and Latin rhythms."
      },
      {
        "word": "tacit",
        "pos": "adjective",
        "phonetic": "/ˈtæs.ɪt/",
        "translation": "Ngầm hiểu",
        "synonyms": [
          "implicit",
          "understood"
        ],
        "example": "He gave tacit approval to the plan."
      },
      {
        "word": "tangential",
        "pos": "adjective",
        "phonetic": "/tænˈdʒen.ʃəl/",
        "translation": "Hơi lạc đề, không liên quan lắm",
        "synonyms": [
          "peripheral",
          "divergent"
        ],
        "example": "A tangential issue."
      },
      {
        "word": "tangible",
        "pos": "adjective",
        "phonetic": "/ˈtæn.dʒə.bəl/",
        "translation": "Hữu hình, có thể sờ/thấy rõ",
        "synonyms": [
          "concrete",
          "physical"
        ],
        "example": "We need tangible evidence."
      },
      {
        "word": "tantamount",
        "pos": "adjective",
        "phonetic": "/ˈtæn.tə.maʊnt/",
        "translation": "Tương đương với",
        "synonyms": [
          "equivalent",
          "equal"
        ],
        "example": "Her refusal to answer was tantamount to an admission of guilt."
      },
      {
        "word": "tautological",
        "pos": "adjective",
        "phonetic": "/ˌtɔː.təˈlɒdʒ.ɪ.kəl/",
        "translation": "Lặp ý, thừa thãi ngôn từ",
        "synonyms": [
          "redundant",
          "repetitive"
        ],
        "example": "\"Free gift\" is a tautological phrase."
      },
      {
        "word": "tedious",
        "pos": "adjective",
        "phonetic": "/ˈtiː.di.əs/",
        "translation": "Tẻ nhạt, chán ngắt",
        "synonyms": [
          "boring",
          "dull"
        ],
        "example": "A tedious job."
      },
      {
        "word": "temerity",
        "pos": "noun",
        "phonetic": "/təˈmer.ə.ti/",
        "translation": "Sự cả gan, liều lĩnh, táo bạo",
        "synonyms": [
          "audacity",
          "nerve"
        ],
        "example": "She had the temerity to call me a liar."
      },
      {
        "word": "temperate",
        "pos": "adjective",
        "phonetic": "/ˈtem.pər.ət/",
        "translation": "Ôn hòa, chừng mực",
        "synonyms": [
          "moderate",
          "mild"
        ],
        "example": "A temperate climate."
      },
      {
        "word": "tenable",
        "pos": "adjective",
        "phonetic": "/ˈten.ə.bəl/",
        "translation": "Có thể bảo vệ/giữ vững",
        "synonyms": [
          "defensible",
          "justifiable"
        ],
        "example": "His theory is no longer tenable."
      },
      {
        "word": "tenet",
        "pos": "noun",
        "phonetic": "/ˈten.ɪt/",
        "translation": "Giáo lý, nguyên lý cơ bản",
        "synonyms": [
          "principle",
          "belief"
        ],
        "example": "It is a tenet of contemporary psychology."
      },
      {
        "word": "tentative",
        "pos": "adjective",
        "phonetic": "/ˈten.tə.tɪv/",
        "translation": "Tạm thời, ngập ngừng",
        "synonyms": [
          "provisional",
          "hesitant"
        ],
        "example": "I have tentative plans to take a trip in July."
      },
      {
        "word": "tenuous",
        "pos": "adjective",
        "phonetic": "/ˈten.ju.əs/",
        "translation": "Mỏng manh, lỏng lẻo",
        "synonyms": [
          "weak",
          "fragile"
        ],
        "example": "A tenuous connection between the two robberies."
      },
      {
        "word": "terse",
        "pos": "adjective",
        "phonetic": "/tɜːs/",
        "translation": "Cộc lốc, ngắn gọn",
        "synonyms": [
          "abrupt",
          "concise"
        ],
        "example": "\"No!\" was the terse reply."
      },
      {
        "word": "tirade",
        "pos": "noun",
        "phonetic": "/taɪˈreɪd/",
        "translation": "Một tràng đả kích, chửi rủa",
        "synonyms": [
          "harangue",
          "diatribe"
        ],
        "example": "She launched into an angry tirade."
      },
      {
        "word": "torpid",
        "pos": "adjective",
        "phonetic": "/ˈtɔː.pɪd/",
        "translation": "Đờ đẫn, uể oải, ngủ lịm",
        "synonyms": [
          "sluggish",
          "lethargic"
        ],
        "example": "Passengers will become torpid and then lose consciousness."
      },
      {
        "word": "touchstone",
        "pos": "noun",
        "phonetic": "/ˈtʌtʃ.stəʊn/",
        "translation": "Đá thử vàng, tiêu chuẩn",
        "synonyms": [
          "criterion",
          "benchmark"
        ],
        "example": "His work has become a touchstone for other writers."
      },
      {
        "word": "tout",
        "pos": "verb",
        "phonetic": "/taʊt/",
        "translation": "Chào hàng, tâng bốc",
        "synonyms": [
          "promote",
          "praise"
        ],
        "example": "He is being widely touted as the next leader."
      },
      {
        "word": "toxic",
        "pos": "adjective",
        "phonetic": "/ˈtɒk.sɪk/",
        "translation": "Độc hại",
        "synonyms": [
          "poisonous",
          "harmful"
        ],
        "example": "Toxic waste."
      },
      {
        "word": "tractable",
        "pos": "adjective",
        "phonetic": "/ˈtræk.tə.bəl/",
        "translation": "Dễ bảo, dễ uốn nắn",
        "synonyms": [
          "docile",
          "manageable"
        ],
        "example": "The problem turned out to be less tractable than expected."
      },
      {
        "word": "transcend",
        "pos": "verb",
        "phonetic": "/trænˈsend/",
        "translation": "Vượt qua giới hạn",
        "synonyms": [
          "surpass",
          "exceed"
        ],
        "example": "Films which transcend cultural barriers."
      },
      {
        "word": "transgress",
        "pos": "verb",
        "phonetic": "/trænzˈɡres/",
        "translation": "Vi phạm, vượt quá giới hạn",
        "synonyms": [
          "violate",
          "infringe"
        ],
        "example": "Anyone who transgresses will be punished."
      },
      {
        "word": "trite",
        "pos": "adjective",
        "phonetic": "/traɪt/",
        "translation": "Sáo mòn, nhàm chán",
        "synonyms": [
          "hackneyed",
          "cliché"
        ],
        "example": "His lyrics about love and peace are too trite."
      },
      {
        "word": "truculent",
        "pos": "adjective",
        "phonetic": "/ˈtrʌk.jə.lənt/",
        "translation": "Hổ báo, thích gây sự",
        "synonyms": [
          "combative",
          "aggressive"
        ],
        "example": "He was pugnacious and truculent."
      },
      {
        "word": "truncate",
        "pos": "verb",
        "phonetic": "/trʌŋˈkeɪt/",
        "translation": "Cắt cụt, thu ngắn lại",
        "synonyms": [
          "shorten",
          "abbreviate"
        ],
        "example": "Coverage of the event was truncated by a technical fault."
      },
      {
        "word": "tumult",
        "pos": "noun",
        "phonetic": "/ˈtjuː.mʌlt/",
        "translation": "Sự ồn ào, náo động, hỗn loạn",
        "synonyms": [
          "uproar",
          "commotion"
        ],
        "example": "You couldn't hear her over the tumult from fans."
      },
      {
        "word": "tyro",
        "pos": "noun",
        "phonetic": "/ˈtaɪə.rəʊ/",
        "translation": "Người mới vào nghề",
        "synonyms": [
          "novice",
          "beginner"
        ],
        "example": "Seeing this young tyro's next ballet."
      },
      {
        "word": "unanimous",
        "pos": "adjective",
        "phonetic": "/juːˈnæn.ɪ.məs/",
        "translation": "Nhất trí đồng lòng",
        "synonyms": [
          "united",
          "in agreement"
        ],
        "example": "The jury returned a unanimous verdict."
      },
      {
        "word": "uncanny",
        "pos": "adjective",
        "phonetic": "/ʌnˈkæn.i/",
        "translation": "Kỳ lạ, huyền bí",
        "synonyms": [
          "eerie",
          "weird"
        ],
        "example": "It was uncanny the way she always knew what he was thinking."
      },
      {
        "word": "uncompromising",
        "pos": "adjective",
        "phonetic": "/ʌnˈkɒm.prə.maɪ.zɪŋ/",
        "translation": "Không khoan nhượng",
        "synonyms": [
          "inflexible",
          "firm"
        ],
        "example": "The city council has taken an uncompromising stand."
      },
      {
        "word": "uncouth",
        "pos": "adjective",
        "phonetic": "/ʌnˈkuːθ/",
        "translation": "Thô lỗ, bất lịch sự",
        "synonyms": [
          "boorish",
          "vulgar"
        ],
        "example": "She thought he was loud and uncouth."
      },
      {
        "word": "undermine",
        "pos": "verb",
        "phonetic": "/ˌʌn.dəˈmaɪn/",
        "translation": "Làm xói mòn, phá hoại ngầm",
        "synonyms": [
          "weaken",
          "sabotage"
        ],
        "example": "Criticism just undermines their confidence."
      },
      {
        "word": "underscore",
        "pos": "verb",
        "phonetic": "/ˌʌn.dəˈskɔːr/",
        "translation": "Nhấn mạnh, gạch dưới",
        "synonyms": [
          "emphasize",
          "highlight"
        ],
        "example": "The report underscores the importance of pre-school education."
      },
      {
        "word": "undulate",
        "pos": "verb",
        "phonetic": "/ˈʌn.dʒʊ.leɪt/",
        "translation": "Gợn sóng, nhấp nhô",
        "synonyms": [
          "ripple",
          "wave"
        ],
        "example": "The road undulates for five miles."
      },
      {
        "word": "unequivocal",
        "pos": "adjective",
        "phonetic": "/ˌʌn.ɪˈkwɪv.ə.kəl/",
        "translation": "Rõ ràng, chắc chắn",
        "synonyms": [
          "clear",
          "unambiguous"
        ],
        "example": "The prime minister had the party's unequivocal support."
      },
      {
        "word": "unfathomable",
        "pos": "adjective",
        "phonetic": "/ʌnˈfæð.ə.mə.bəl/",
        "translation": "Không thể đo lường/hiểu thấu được",
        "synonyms": [
          "incomprehensible",
          "deep"
        ],
        "example": "For some unfathomable reason they built the toilet next to the kitchen."
      },
      {
        "word": "unprecedented",
        "pos": "adjective",
        "phonetic": "/ʌnˈpres.ɪ.den.tɪd/",
        "translation": "Chưa từng có tiền lệ",
        "synonyms": [
          "unparalleled",
          "unique"
        ],
        "example": "Environmental destruction on an unprecedented scale."
      },
      {
        "word": "unrelenting",
        "pos": "adjective",
        "phonetic": "/ˌʌn.rɪˈlen.tɪŋ/",
        "translation": "Không buông tha, liên tục",
        "synonyms": [
          "relentless",
          "continuous"
        ],
        "example": "Unrelenting pressure."
      },
      {
        "word": "unseemly",
        "pos": "adjective",
        "phonetic": "/ʌnˈsiːm.li/",
        "translation": "Không phù hợp, khiếm nhã",
        "synonyms": [
          "improper",
          "inappropriate"
        ],
        "example": "Unseemly behavior."
      },
      {
        "word": "untenable",
        "pos": "adjective",
        "phonetic": "/ʌnˈten.ə.bəl/",
        "translation": "Không thể chống đỡ, biện hộ",
        "synonyms": [
          "indefensible",
          "unsupportable"
        ],
        "example": "Isn't this an untenable situation?"
      },
      {
        "word": "unwitting",
        "pos": "adjective",
        "phonetic": "/ʌnˈwɪt.ɪŋ/",
        "translation": "Vô tình, không biết rõ",
        "synonyms": [
          "unintentional",
          "accidental"
        ],
        "example": "They were the unwitting victims of a drug dealer."
      },
      {
        "word": "urbane",
        "pos": "adjective",
        "phonetic": "/ɜːˈbeɪn/",
        "translation": "Trang nhã, lịch thiệp",
        "synonyms": [
          "suave",
          "refined"
        ],
        "example": "Herschel was an urbane, kindly, and generous man."
      },
      {
        "word": "usurp",
        "pos": "verb",
        "phonetic": "/juːˈzɜːp/",
        "translation": "Chiếm đoạt trái phép",
        "synonyms": [
          "seize",
          "take over"
        ],
        "example": "Local control is being usurped by central government."
      },
      {
        "word": "utilitarian",
        "pos": "adjective",
        "phonetic": "/ˌjuː.tɪ.lɪˈteə.ri.ən/",
        "translation": "Thực dụng",
        "synonyms": [
          "practical",
          "functional"
        ],
        "example": "A very ugly utilitarian building."
      },
      {
        "word": "utopia",
        "pos": "noun",
        "phonetic": "/juːˈtəʊ.pi.ə/",
        "translation": "Xã hội không tưởng",
        "synonyms": [
          "paradise",
          "Eden"
        ],
        "example": "Imagine a perfect society, a utopia."
      },
      {
        "word": "vacuous",
        "pos": "adjective",
        "phonetic": "/ˈvæk.ju.əs/",
        "translation": "Trống rỗng, ngớ ngẩn",
        "synonyms": [
          "empty",
          "mindless"
        ],
        "example": "A vacuous remark."
      },
      {
        "word": "vagary",
        "pos": "noun",
        "phonetic": "/ˈveɪ.ɡər.i/",
        "translation": "Sự thay đổi bất thường",
        "synonyms": [
          "whim",
          "caprice"
        ],
        "example": "The vagaries of the English weather."
      },
      {
        "word": "vain",
        "pos": "adjective",
        "phonetic": "/veɪn/",
        "translation": "Kiêu ngạo, vô ích",
        "synonyms": [
          "conceited",
          "futile"
        ],
        "example": "He was very vain about his hair and his clothes."
      },
      {
        "word": "valid",
        "pos": "adjective",
        "phonetic": "/ˈvæl.ɪd/",
        "translation": "Hợp lệ, có cơ sở vững chắc",
        "synonyms": [
          "legitimate",
          "sound"
        ],
        "example": "My way of thinking might be equally valid."
      },
      {
        "word": "validate",
        "pos": "verb",
        "phonetic": "/ˈvæl.ɪ.deɪt/",
        "translation": "Phê chuẩn, xác nhận",
        "synonyms": [
          "confirm",
          "authenticate"
        ],
        "example": "The data is validated automatically by the computer."
      },
      {
        "word": "vapid",
        "pos": "adjective",
        "phonetic": "/ˈvæp.ɪd/",
        "translation": "Nhạt nhẽo, vô vị",
        "synonyms": [
          "dull",
          "insipid"
        ],
        "example": "A vapid reality TV show."
      },
      {
        "word": "vehement",
        "pos": "adjective",
        "phonetic": "/ˈviː.ə.mənt/",
        "translation": "Mãnh liệt, kịch liệt",
        "synonyms": [
          "passionate",
          "forceful"
        ],
        "example": "Vehement opposition from his family."
      },
      {
        "word": "venal",
        "pos": "adjective",
        "phonetic": "/ˈviː.nəl/",
        "translation": "Dễ mua chuộc, hối lộ",
        "synonyms": [
          "corrupt",
          "mercenary"
        ],
        "example": "A venal ruler."
      },
      {
        "word": "verdant",
        "pos": "adjective",
        "phonetic": "/ˈvɜː.dənt/",
        "translation": "Xanh tươi",
        "synonyms": [
          "green",
          "lush"
        ],
        "example": "The verdant countryside."
      },
      {
        "word": "vestige",
        "pos": "noun",
        "phonetic": "/ˈves.tɪdʒ/",
        "translation": "Vết tích, tàn dư",
        "synonyms": [
          "trace",
          "remnant"
        ],
        "example": "The last vestiges of a colonial past."
      },
      {
        "word": "vex",
        "pos": "verb",
        "phonetic": "/veks/",
        "translation": "Làm bực mình, quấy rầy",
        "synonyms": [
          "annoy",
          "irritate"
        ],
        "example": "This issue looks likely to continue to vex the government."
      },
      {
        "word": "viable",
        "pos": "adjective",
        "phonetic": "/ˈvaɪ.ə.bəl/",
        "translation": "Có thể tồn tại/thành công",
        "synonyms": [
          "feasible",
          "workable"
        ],
        "example": "In order to make the company viable."
      },
      {
        "word": "vicarious",
        "pos": "adjective",
        "phonetic": "/vɪˈkeə.ri.əs/",
        "translation": "Trải nghiệm gián tiếp",
        "synonyms": [
          "indirect",
          "secondhand"
        ],
        "example": "She took a vicarious pleasure in her friend's achievements."
      },
      {
        "word": "vicissitude",
        "pos": "noun",
        "phonetic": "/vɪˈsɪs.ɪ.tʃuːd/",
        "translation": "Sự thăng trầm, biến đổi",
        "synonyms": [
          "fluctuation",
          "alteration"
        ],
        "example": "Losing your job is just one of the vicissitudes of life."
      },
      {
        "word": "vigilant",
        "pos": "adjective",
        "phonetic": "/ˈvɪdʒ.əl.ənt/",
        "translation": "Cảnh giác, thận trọng",
        "synonyms": [
          "watchful",
          "alert"
        ],
        "example": "Security personnel need to be more vigilant."
      },
      {
        "word": "vilify",
        "pos": "verb",
        "phonetic": "/ˈvɪl.ɪ.faɪ/",
        "translation": "Phỉ báng, nói xấu",
        "synonyms": [
          "defame",
          "malign"
        ],
        "example": "He was vilified by the press as a monster."
      },
      {
        "word": "vindictive",
        "pos": "adjective",
        "phonetic": "/vɪnˈdɪk.tɪv/",
        "translation": "Có ý thù dai, muốn trả thù",
        "synonyms": [
          "vengeful",
          "spiteful"
        ],
        "example": "A lawyer's family is threatened by a vindictive former prisoner."
      },
      {
        "word": "virtuoso",
        "pos": "noun",
        "phonetic": "/ˌvɜː.tʃuˈəʊ.səʊ/",
        "translation": "Bậc thầy nghệ thuật/âm nhạc",
        "synonyms": [
          "master",
          "expert"
        ],
        "example": "Cole was also a virtuoso on the piano."
      },
      {
        "word": "virulent",
        "pos": "adjective",
        "phonetic": "/ˈvɪr.ə.lənt/",
        "translation": "Kịch độc, độc ác",
        "synonyms": [
          "toxic",
          "hostile"
        ],
        "example": "A particularly virulent strain of flu."
      },
      {
        "word": "viscous",
        "pos": "adjective",
        "phonetic": "/ˈvɪs.kəs/",
        "translation": "Sền sệt, nhớt",
        "synonyms": [
          "thick",
          "sticky"
        ],
        "example": "Viscous liquid."
      },
      {
        "word": "vitiate",
        "pos": "verb",
        "phonetic": "/ˈvɪʃ.i.eɪt/",
        "translation": "Làm hỏng, làm vô giá trị",
        "synonyms": [
          "spoil",
          "impair"
        ],
        "example": "American military power should never be vitiated by political concerns."
      },
      {
        "word": "vitriolic",
        "pos": "adjective",
        "phonetic": "/ˌvɪt.riˈɒl.ɪk/",
        "translation": "Chua chát, đầy thù hằn",
        "synonyms": [
          "caustic",
          "bitter"
        ],
        "example": "He launched a vitriolic attack on the prime minister."
      },
      {
        "word": "vituperate",
        "pos": "verb",
        "phonetic": "/vɪˈtʃuː.pə.reɪt/",
        "translation": "Chửi rủa, trách móc dữ dội",
        "synonyms": [
          "berate",
          "scold"
        ],
        "example": "The driver vituperated the cyclist."
      },
      {
        "word": "vivacious",
        "pos": "adjective",
        "phonetic": "/vɪˈveɪ.ʃəs/",
        "translation": "Hoạt bát, lanh lợi",
        "synonyms": [
          "lively",
          "animated"
        ],
        "example": "His wife, a vivacious blonde."
      },
      {
        "word": "vocation",
        "pos": "noun",
        "phonetic": "/vəʊˈkeɪ.ʃən/",
        "translation": "Thiên hướng, nghề nghiệp",
        "synonyms": [
          "calling",
          "profession"
        ],
        "example": "To work in medicine, you should have a vocation for it."
      },
      {
        "word": "volition",
        "pos": "noun",
        "phonetic": "/vəˈlɪʃ.ən/",
        "translation": "Ý chí, sự tự nguyện",
        "synonyms": [
          "will",
          "choice"
        ],
        "example": "He had left the band of his own volition."
      },
      {
        "word": "voluble",
        "pos": "adjective",
        "phonetic": "/ˈvɒl.jə.bəl/",
        "translation": "Liến thoắng, nhiều lời",
        "synonyms": [
          "talkative",
          "loquacious"
        ],
        "example": "She was a voluble, smart, funny interviewee."
      },
      {
        "word": "voluminous",
        "pos": "adjective",
        "phonetic": "/vəˈluː.mɪ.nəs/",
        "translation": "Thùng thình, rất lớn",
        "synonyms": [
          "capacious",
          "bulky"
        ],
        "example": "Her voluminous silk dress billowed out behind her."
      },
      {
        "word": "voracious",
        "pos": "adjective",
        "phonetic": "/vəˈreɪ.ʃəs/",
        "translation": "Tham ăn, ngấu nghiến",
        "synonyms": [
          "ravenous",
          "insatiable"
        ],
        "example": "He has a voracious appetite for reading."
      },
      {
        "word": "wane",
        "pos": "verb",
        "phonetic": "/weɪn/",
        "translation": "Khuyết, suy yếu dần",
        "synonyms": [
          "decline",
          "fade"
        ],
        "example": "The band's popularity was beginning to wane."
      },
      {
        "word": "wanton",
        "pos": "adjective",
        "phonetic": "/ˈwɒn.tən/",
        "translation": "Cố tình, bừa bãi, không kiêng dè",
        "synonyms": [
          "reckless",
          "malicious"
        ],
        "example": "Wanton destruction of human life."
      },
      {
        "word": "warrant",
        "pos": "verb",
        "phonetic": "/ˈwɒr.ənt/",
        "translation": "Bảo đảm, biện minh",
        "synonyms": [
          "justify",
          "necessitate"
        ],
        "example": "I don't think it warranted such a severe punishment."
      },
      {
        "word": "wary",
        "pos": "adjective",
        "phonetic": "/ˈweə.ri/",
        "translation": "Thận trọng, cảnh giác",
        "synonyms": [
          "cautious",
          "careful"
        ],
        "example": "I'm a little wary of giving people my address."
      },
      {
        "word": "whimsical",
        "pos": "adjective",
        "phonetic": "/ˈwɪm.zɪ.kəl/",
        "translation": "Bất chợt, kỳ quái nhưng thú vị",
        "synonyms": [
          "fanciful",
          "playful"
        ],
        "example": "A whimsical tale."
      },
      {
        "word": "wily",
        "pos": "adjective",
        "phonetic": "/ˈwaɪ.li/",
        "translation": "Quỷ quyệt, lắm mưu nhiều kế",
        "synonyms": [
          "cunning",
          "crafty"
        ],
        "example": "A wily politician."
      },
      {
        "word": "winsome",
        "pos": "adjective",
        "phonetic": "/ˈwɪn.səm/",
        "translation": "Hấp dẫn, lôi cuốn tươi tắn",
        "synonyms": [
          "charming",
          "appealing"
        ],
        "example": "She gave her mother a winsome smile."
      },
      {
        "word": "wistful",
        "pos": "adjective",
        "phonetic": "/ˈwɪst.fəl/",
        "translation": "Bâng khuâng, luyến tiếc",
        "synonyms": [
          "nostalgic",
          "longing"
        ],
        "example": "A wistful smile."
      },
      {
        "word": "yearn",
        "pos": "verb",
        "phonetic": "/jɜːn/",
        "translation": "Khao khát, mong mỏi",
        "synonyms": [
          "long",
          "desire"
        ],
        "example": "He still yearns for critical approval."
      },
      {
        "word": "zealot",
        "pos": "noun",
        "phonetic": "/ˈzel.ət/",
        "translation": "Người cuồng tín",
        "synonyms": [
          "fanatic",
          "extremist"
        ],
        "example": "A religious zealot."
      },
      {
        "word": "zenith",
        "pos": "noun",
        "phonetic": "/ˈzen.ɪθ/",
        "translation": "Đỉnh cao nhất",
        "synonyms": [
          "peak",
          "pinnacle"
        ],
        "example": "Tolstoy was at the zenith of his achievement."
      },
      {
        "word": "zephyr",
        "pos": "noun",
        "phonetic": "/ˈzef.ər/",
        "translation": "Làn gió nhẹ mát",
        "synonyms": [
          "breeze",
          "draft"
        ],
        "example": "A gentle zephyr blew across the field."
      }
    ]
  }
];
