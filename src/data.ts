import { Sermon, MinistryEvent, BibleStudyLesson, PrayerRequest, ActivityLog, BlogPost } from './types';

export const INITIAL_SERMONS: Sermon[] = [
  {
    id: 'sermon-1',
    title: "Walking on Water: Overcoming Life's Storms",
    description: "In this powerful message, we explore Matthew 14 and learn how to keep our eyes fixed on Christ amidst the chaos of life. Trusting God in difficult seasons yields deep peace.",
    topic: "The Power of Faith",
    book: "Matthew",
    language: "English",
    type: "video",
    duration: "45:12",
    date: "May 12, 2024",
    speaker: "Pradeep Shinde",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB58HYK5MeZb_Ps2NVHScusVawOwPfvNQImbtvf5uN26n-8RvRft67jn--21cVucJg28waHcqkAVN980ltdsvygTZoIfzUPPJRUaCu4vo1BNf2800PGAFBzRuBqJCGXj-wUk1hWIPSChGfFYA6XkAlXoYg7veZ8z-r0EqzYdgeSclybX7-Z7C7fFLUCDYCdVMTck3sE4_tUqWw-B-8csZsAJfYBM0gBrQcUT64TjHWWMc_7gMemBdVJ6w",
    mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 'sermon-2',
    title: "The Architecture of Prayer: Rebuilding Your Inner Life",
    description: "A deep dive into the Lord's Prayer, focusing on the structural importance of daily communion with the Father. Discover the spiritual foundations of active intercession.",
    topic: "Biblical Wisdom",
    book: "Psalms",
    language: "English",
    type: "audio",
    duration: "32:45",
    date: "April 28, 2024",
    speaker: "Pradeep Shinde",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6tFLBp60U01F68nImhALb65PujBhaxwLPmFLrFtYLeMguqx2B3kF7WY8KXzwDfaC6qL6x4nNkdv8MPn9DNL-Q6EwmvByBOtrE1C5LBjybmI5-FkdYu2uEWI9hL8vFtSLhC0sZoXYUEdWqPlaK6hPyrH4XyivXDeQfhNPsyg_2MP44yttBiRHPc-2SUb60yEtmx0p9t2fL8CQi9BRsoGuKA-VCwQaNBvevIksB2DFCsV3bOBnr4xl6TA",
    mediaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 'sermon-3',
    title: "Guided by Grace: Recognizing the Spirit's Voice",
    description: "Understanding the subtle yet powerful ways the Holy Spirit leads us in our daily decision-making processes. Learn to quiet the background noise of modern life.",
    topic: "Holy Spirit",
    book: "John",
    language: "English",
    type: "video",
    duration: "51:20",
    date: "April 15, 2024",
    speaker: "Pradeep Shinde",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSBf8uvv9ZL1Hk_73BKcNCzs9c5PoGZZfGLz1Lq8p_dR8S1pvEmd896ugiw2tb6zaBMzFp2ajmGrMyjmfZXB3vXF4iWaf9AgISMv5BAZTwU3yM_2bxlpTUe_TqtUeG_Jus4pa_e6v2U-Mae1rCGBzJl-7oXhPZ2TpY03lhUB7886PO1nfEAKfH3W03RT48eDMIsim5TgbvndmlNr2XSA5mJ-NmrheWWnl1LYOiSt2e08g2mCQ4UPnvjA",
    mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 'sermon-4',
    title: "In the Beginning: Part 1 of the Word Series",
    description: "The prologue of John holds the key to our understanding of the divinity of Christ. We begin our 12-week study looking closely at how God revealed His eternal design.",
    topic: "The Gospel of John",
    book: "John",
    language: "English",
    type: "series",
    duration: "12-Part Series",
    date: "March 30, 2024",
    speaker: "Pradeep Shinde",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuIt_sffC8q2UHSHYFgadIOOjYpZp7WEEWKFTCMfBSVTlCTaz_WZpCKZoSlSqqc4juKM-HuSabe7sJbUHeyueMTXeeWCGoBLf3pVsfvaFPGCszID4aQ2ty3O2NcV5uIFXBPfEqSyRcCDqBquBy82HKn1nzb816-PaJajaSxXj3paS72BaYHhjxJtL-s9XIKIlf6vMQwAUVFuQXfz43NF8Rl5fVRDtAYmfJ2F1s6edYTFQk1q85ddlRCw",
    mediaUrl: ""
  },
  {
    id: 'sermon-5',
    title: "Finding Rest in a Busy World",
    description: "A 15-minute meditative teaching on the spiritual discipline of rest and Sabbath in our modern, high-speed lives. Discover the biblical pattern for mental and spiritual rejuvenation.",
    topic: "Daily Devotion",
    book: "Genesis",
    language: "English",
    type: "audio",
    duration: "15:00",
    date: "March 22, 2024",
    speaker: "Pradeep Shinde",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCb9X49rITYJ8cqTktdVqqSrTMvCKiSnu13tZEMmjGQoVjRseqWZ59BPAKAzvstezmWhE8FU2h3yvE_A1CWCE2CUL9KV7kXi-SyOKCggcdCtSHWY4o_xMYzjOBFeMESncicoGTTa6uvG-aXL-f_zOq86hvEoVvkhnHcS-RnFuA1WSRo_cK0F2QFykvYYbm0-EE-ImjbWOk1nekuXZZaZZ13IsYQsphX4lat9r5y9u-EtWuqS_xFTTLKPA",
    mediaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 'sermon-6',
    title: "ದೇವರ ವಾಕ್ಯದ ಶಕ್ತಿ (The Power of God's Word)",
    description: "A foundational teaching in Kannada exploring how the scriptures transform our everyday lives, heal our hurts, and renew our perspective with sovereign strength.",
    topic: "Regional Outreach",
    book: "Psalms",
    language: "Kannada",
    type: "video",
    duration: "48:10",
    date: "March 15, 2024",
    speaker: "Pradeep Shinde",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlctL8j9N8UZW2l1YbTwu0zxcL8NVV-yHZCsgc2Z2tzx2SVOQvkNqQHe0kUuKiQ8Yx-MvVQaC4baAi5B0CfRaIC83N6qWuNzRI77y_h8HJjwy5gUIH6PKH-d5cH2hRRoUBPuLtAPfdgv060S7zOVe8cuQZQD34oDj3naGKCE3sbzpTuV_wHcB13m6gNJcU8rNxivIwMGJU23f6JtBx5lkuHIzQbV9t9oZoW88eLFcpWxmeAsAC52exzQ",
    mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }
];

export const INITIAL_EVENTS: MinistryEvent[] = [
  {
    id: 'event-1',
    title: "City-Wide Revival Prayer",
    description: "Join us for a powerful evening of prayer and worship as we gather the city's faithful. Come expectant for miracles, healing, and absolute spiritual restoration in His Presence.",
    date: "June 15, 2024",
    location: "Main Sanctuary & Live Online",
    type: "prayer",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAz6TZAqAjSBPdkNMNG_sMI9wDknX66YXFy73FDf547mkU6fG4rMjHyp5A5NY7ytKUuUVa5kMmzDAl9F2IIjgYdG6tDN_xskY-v_lnqvf3duQ-62bjgtobGIBiwmqetL90JVPRGKe9DaIOWrcch92qX94pXNeoaqJuQEUZpG7WTg8CgwSkOvditQeImzETI1famK0he0LDnZ4mcjY7kt-fjHRBZUToOULmiRFb5eB3Re0zzMIQmx-Z5tA"
  },
  {
    id: 'event-2',
    title: "Theology & Modern Life",
    description: "An interactive session discussing how timeless scriptures apply to our modern digital age. Learn to develop solid, logical, and faith-driven frameworks for handling modern career and social questions.",
    date: "Weekly Tuesdays",
    location: "Community Center Hall B",
    type: "bible_study",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMnglCMOun7Z2-PGIQJF0Lqf518Ob9YMMtq0Fd5guCAqydc3kL6W_-H-mQbtYM5MvwtGCDFUQ0j6T_4FIPrBcor20et2jU9H1GzhKXWSBL48cuIcd_Swcq5aJPZ5Vsm_dpNPwJ8sHY2WNoPczT4byoH6PELVTfleAXGvrZV_ZUiRHxhwl5xXPRYaIMBAowfbTBrxUAyvA4vp-x7hIccG03pHLdCbI1bUAIl_xKhU0nfqSH5A18gJLqSQ"
  },
  {
    id: 'event-3',
    title: "Sunday Service Live",
    description: "Connect with our global congregation every Sunday morning for live worship, heartfelt communion, and an authoritative message of divine peace from Evangelist Pradeep Shinde.",
    date: "Weekly Sundays - 9:00 AM",
    location: "YouTube Live Broadcast",
    type: "live",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDB7iY1fQiooPl-ylCmSTVQR7HQYKk9JmTZxZr7Ev9gCicEfvuFL1o1oIgWCwA3uzRc-XKkOhv1lvi1dyUWE5tUajw9fx06yXDoasDsDfBVcqv6WuQgyStzlrUP0mBnyzpcYXz1Zi_6g2YVR0NPK2iZYougQdu_Vg1oPMZaHiqR1SyyIf_dZOMmAzpExllKapGqCbU7QESm93_AP5Kr07-8xZfKiLn6SKA3ZRig37ENgGFVzX5ev7IVzg"
  }
];

export const INITIAL_BIBLE_LESSONS: BibleStudyLesson[] = [
  {
    id: 'lesson-1',
    title: "Life in the Spirit",
    reference: "Romans 8:1-39",
    category: "Weekly Exegesis",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgremkm9IOtZvhgysZjV5FJn663RPGDPAztOJdVxhhvSZuMGOVOPzTYJWwNZUR_YTTJfgElOBp_IB22dvVIwGi8d7pX9-5mYKc1Qe0IVMixNeV9gLpPnzIrN9OiIiBaCqiGqnWeJggxw9XGMUdOmV3huOfGzgdzSU9qmwR-P0Td0aLD60ckJvpjzhVzR-ycYrAn6iF2zGrdygquKpRrUwD5xAqfxw7HrOESfe4ZbOWET-28dKBduPkzA",
    context: "Romans 8 represents the pinnacle of Paul's theological exposition in the Epistle to the Romans. Having established the universality of sin and the mechanism of justification by faith in earlier chapters, Paul now turns to the practical and spiritual reality of the believer's life in Christ. This chapter serves as a bridge between the struggle of the flesh (Chapter 7) and the sovereign plan of God (Chapters 9-11).\n\nThe historical setting of the Roman church was one of diverse cultural tensions between Jewish and Gentile believers. Paul writes to unify them under the singular identity of being \"in Christ,\" a phrase that appears frequently and serves as the anchor for the entire discourse.",
    interpretation: "The Greek word for \"condemnation\" (*katakrima*) refers to a judicial sentence. Paul's opening statement is not merely a psychological comfort but a legal declaration of status. The shift from \"under the law\" to \"under grace\" is mediated by the Holy Spirit, who is mentioned more times in this chapter than in the rest of Romans combined.\n\nVerses 18-25 introduce the concept of \"groaning\"—the groaning of creation, the groaning of believers, and the groaning of the Spirit. This tripartite suffering is not one of despair, but of labor pains—the expectation of a future glory that outweighs present trials.\n\nThe chapter concludes with a majestic hymn of assurance (vv. 31-39), asserting that nothing—neither death nor life, angels nor rulers—can separate the believer from the love of God. The forensic language returns (\"Who shall bring any charge?\"), reinforcing the theme of absolute security in Christ.",
    reflection: [
      "How does the reality of \"no condemnation\" change the way you approach God in prayer today?",
      "In what areas of your life are you currently \"groaning\" for restoration, and how does the Spirit help you in your weakness?",
      "The assurance of Romans 8:31-39 is absolute. Which \"separation\" (e.g., fear, past, circumstances) do you need to surrender to God's love this week?"
    ],
    crossReferences: [
      { reference: "Genesis 3:17-19", text: "On the subjection of creation to futility due to human sin." },
      { reference: "Galatians 4:6", text: "The Spirit of adoption and the cry of \"Abba, Father.\"" },
      { reference: "Psalm 44:22", text: "Quoted in verse 36, emphasizing the historical reality of suffering for God's people." },
      { reference: "Katakrima", text: "See Thayer's Greek Lexicon for detailed judicial usage in 1st-century literature." }
    ]
  },
  {
    id: 'lesson-2',
    title: "The Call of Abraham",
    reference: "Genesis 12:1-9",
    category: "Covenant Studies",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4-ZZrOzu7UttwfjT30RwGT9xE7YKTpklSJZh5G_8z5qoz4FvXOLmnwweNSN0-j1pMl5oR7g3wCbylK2EHgZZz3kAi9wIzh3JWMr37zdxuNHMMW8elRZdh3UgFtagzhZlgIJkCdrnYah2KNjWkr-c5sn7Ar01TJ73NmB4P3vI4Rud8afGns-KZiOYJEjE3X8qBm9vNMYvWTvpzB9Vv05GGjMb3nYGYwvP3ZSyBf4-3oEjTFq5JJnCLLA",
    context: "God's call to Abram (later Abraham) represents one of the major turning points in the narrative of Genesis. Following the catastrophic rebellion at Babel, God narrows His focus to a single man and his family to begin His global plan of redemptive blessing.",
    interpretation: "God commands Abram to 'go' from his country, his people, and his father's household. This required absolute separation from the comfort of Pagan idolatry to step into a land that God would show him. God covenants to make Abram a great nation, bless him, make his name great, and make him a blessing to all peoples.",
    reflection: [
      "What comforts is God calling you to step away from to step into His greater promise?",
      "How does Abraham's prompt obedience inspire your walk of faith when outcomes are unseen?",
      "In what ways are you actively seeking to be a channel of God's blessing to those around you?"
    ],
    crossReferences: [
      { reference: "Hebrews 11:8-10", text: "By faith Abraham obeyed when he was called to go out to a place he would receive as an inheritance." },
      { reference: "Galatians 3:7-9", text: "Understand, then, that those who have faith are children of Abraham." }
    ]
  }
];

export const INITIAL_PRAYER_REQUESTS: PrayerRequest[] = [
  {
    id: 'prayer-1',
    name: "John Doe",
    need: "Urgent prayer for complete healing of chronic respiratory infection. Asking for restorative strength and peace of mind during treatments.",
    date: "July 15, 2026",
    status: "Pending",
    isUrgent: true
  },
  {
    id: 'prayer-2',
    name: "Meera Shastry",
    need: "Prayers for a family situation. Praying for reconciliatory wisdom and mutual understanding during a tough financial season.",
    date: "July 14, 2026",
    status: "Reviewed",
    isUrgent: false
  },
  {
    id: 'prayer-3',
    name: "Daniel Kumar",
    need: "Praying for guidance on my upcoming theological exams and future career in youth ministry.",
    date: "July 12, 2026",
    status: "Prayed For",
    isUrgent: false
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    title: 'New Sermon Uploaded: "The Armor of God - Part 2"',
    timestamp: '2 hours ago',
    type: 'sermon',
    details: 'By Admin • Topic: Biblical Warfare • Video format'
  },
  {
    id: 'log-2',
    title: 'New Prayer Request received from John Doe',
    timestamp: '5 hours ago',
    type: 'prayer',
    details: 'Urgent • Needs physical healing support'
  },
  {
    id: 'log-3',
    title: 'Donation of $250.00 received',
    timestamp: '8 hours ago',
    type: 'donation',
    details: 'Global Mission Fund • Online anonymous donor'
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: "Understanding the Grace of God in Times of Trial",
    summary: "A practical reflection on maintaining hope and divine connection when faced with professional and personal storms, grounded in the Book of Romans.",
    content: `Grace is not merely a ticket to heaven; it is the active, dynamic power of God operating in the believer's life. In times of difficulty, it is natural to feel isolated, but Romans 8:28 reminds us that God works all things together for the good of those who love Him.\n\n### The Anchor of Grace\n\nWhen we look at the life of the Apostle Paul, we see a man who faced shipwrecks, beatings, and imprisonment. Yet, his response was always one of joy and praise. Why? Because he understood that grace is sufficient. \n\n1. **First Point**: God's grace is not dependent on our circumstances. It is a sovereign, unmerited favor.\n2. **Second Point**: Trials are often the soil in which the deepest faith is grown. Just as gold is refined by fire, our faith is strengthened by endurance.\n3. **Third Point**: We have a continuous mediator in Jesus Christ, who intercedes for us even when we do not know how to pray.\n\n### Practical Application\n\nHow do we live this out? Start by shifting your focus from the storm to the Savior. Dedicate five minutes each morning to listing things you are grateful for, and let the peace of God guard your heart and mind.`,
    author: "Evangelist Pradeep Shinde",
    date: "July 12, 2026",
    category: "Devotional",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB58HYK5MeZb_Ps2NVHScusVawOwPfvNQImbtvf5uN26n-8RvRft67jn--21cVucJg28waHcqkAVN980ltdsvygTZoIfzUPPJRUaCu4vo1BNf2800PGAFBzRuBqJCGXj-wUk1hWIPSChGfFYA6XkAlXoYg7veZ8z-r0EqzYdgeSclybX7-Z7C7fFLUCDYCdVMTck3sE4_tUqWw-B-8csZsAJfYBM0gBrQcUT64TjHWWMc_7gMemBdVJ6w",
    readTime: "4 min read"
  },
  {
    id: 'blog-2',
    title: "A Study of Covenant: Abrahamic Faith and Modern Stewardship",
    summary: "Deep theological analysis of Genesis 12 and the structural blueprint of covenantal obedience for modern families.",
    content: `The Abrahamic Covenant is the foundation of biblical history. When God told Abram to leave Haran, He wasn't just asking for a change of address; He was calling for an entire reorientation of Abram's allegiance and trust.\n\n### The Nature of the Call\n\nTo leave behind one's country, kinsmen, and father's house in the ancient near east was to surrender security, inheritance, and status. Yet Abraham obeyed. This prompt obedience set the standard for what we now understand as "justification by faith."\n\n- **Separation**: Stepping away from the safety net of cultural comforts.\n- **Vision**: Moving towards a destination defined solely by the voice of God.\n- **Blessing**: Realizing that God's grace to us is intended to flow *through* us to bless the nations.\n\nStewardship in the modern era is no different. We are called to be channels, not reservoirs, of God's resources, talents, and time.`,
    author: "Evangelist Pradeep Shinde",
    date: "July 08, 2026",
    category: "Theology",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4-ZZrOzu7UttwfjT30RwGT9xE7YKTpklSJZh5G_8z5qoz4FvXOLmnwweNSN0-j1pMl5oR7g3wCbylK2EHgZZz3kAi9wIzh3JWMr37zdxuNHMMW8elRZdh3UgFtagzhZlgIJkCdrnYah2KNjWkr-c5sn7Ar01TJ73NmB4P3vI4Rud8afGns-KZiOYJEjE3X8qBm9vNMYvWTvpzB9Vv05GGjMb3nYGYwvP3ZSyBf4-3oEjTFq5JJnCLLA",
    readTime: "6 min read"
  },
  {
    id: 'blog-3',
    title: "The Importance of Expository Bible Study in the Digital Age",
    summary: "An urgent ministry update discussing our newly launched weekly online Bible studies and why systematic scriptural depth matters now more than ever.",
    content: `In an era of soundbites, quick videos, and digital distractions, deep systematic studying of the Bible has become a rare but vital discipline. This is why our ministry is focusing heavily on the Exegesis of scripture.\n\nExpository study means allowing the text to speak for itself in its original historical, cultural, and linguistic context, rather than importing our pre-conceived ideas onto the text.\n\n### Why Systematic Study Matters\n\n- **Protects Against Deception**: A robust knowledge of the whole counsel of God keeps us grounded when cultural tides shift.\n- **Nourishes the Soul**: Topical sermons are wonderful, but systematic exegesis feeds the deeper spiritual appetite.\n- **Fosters Community**: Gathering weekly to debate, reflect, and share cross-references builds deep relational bonds.\n\nJoin us every week as we walk verse-by-verse through the Epistle to the Romans!`,
    author: "Pradeep Shinde Ministry Team",
    date: "July 01, 2026",
    category: "Ministry Update",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgremkm9IOtZvhgysZjV5FJn663RPGDPAztOJdVxhhvSZuMGOVOPzTYJWwNZUR_YTTJfgElOBp_IB22dvVIwGi8d7pX9-5mYKc1Qe0IVMixNeV9gLpPnzIrN9OiIiBaCqiGqnWeJggxw9XGMUdOmV3huOfGzgdzSU9qmwR-P0Td0aLD60ckJvpjzhVzR-ycYrAn6iF2zGrdygquKpRrUwD5xAqfxw7HrOESfe4ZbOWET-28dKBduPkzA",
    readTime: "5 min read"
  }
];
