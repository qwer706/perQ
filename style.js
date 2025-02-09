// Select DOM elements
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const progress = document.getElementById('progress');
const quizSection = document.getElementById('quiz-section');
const resultSection = document.getElementById('result-section');
const resultText = document.getElementById('result-text');

// Questions and scoring logic based on MBTI
const questions = [
    {
        question: "هل تحب التجربة والابتكار؟",
        options: ["نعم دائمًا", "أحيانًا", "نادرًا", "أبدًا"],
        trait: "openness",
        scores: [3, 2, 1, 0]
    },
    {
        question: "هل تعتبر نفسك شخصًا منظمًا؟",
        options: ["نعم دائمًا", "أحيانًا", "نادرًا", "أبدًا"],
        trait: "conscientiousness",
        scores: [3, 2, 1, 0]
    },
    {
        question: "هل تستمتع بالتواجد مع الآخرين؟",
        options: ["نعم دائمًا", "أحيانًا", "نادرًا", "أبدًا"],
        trait: "extraversion",
        scores: [3, 2, 1, 0]
    },
    {
        question: "هل تميل إلى التعاون مع الآخرين؟",
        options: ["نعم دائمًا", "أحيانًا", "نادرًا", "أبدًا"],
        trait: "agreeableness",
        scores: [3, 2, 1, 0]
    },
    {
        question: "هل تشعر بالقلق أو التوتر غالبًا؟",
        options: ["نعم دائمًا", "أحيانًا", "نادرًا", "أبدًا"],
        trait: "neuroticism",
        scores: [3, 2, 1, 0]
    },
    {
        question: "هل تفضل العمل بمفردك أم ضمن فريق؟",
        options: ["بمفردي", "ضمن فريق"],
        trait: "introversion_extraversion",
        scores: [0, 1] // 0 = انطوائي, 1 = انبساطي
    },
    {
        question: "هل تفكر أكثر بالتفاصيل أم بالصورة العامة؟",
        options: ["التفاصيل", "الصورة العامة"],
        trait: "sensing_intuition",
        scores: [0, 1] // 0 = حسي, 1 = بديهي
    },
    {
        question: "هل تعتمد على العقل أم المشاعر عند اتخاذ القرارات؟",
        options: ["العقل", "المشاعر"],
        trait: "thinking_feeling",
        scores: [0, 1] // 0 = عقلاني, 1 = عاطفي
    },
    {
        question: "هل تفضل الالتزام بالخطط أم التكيف مع المواقف؟",
        options: ["الالتزام بالخطط", "التكيف مع المواقف"],
        trait: "judging_perceiving",
        scores: [0, 1] // 0 = حكمي, 1 = مدرك
    }
];

let currentQuestionIndex = 0;
let selectedAnswer = null;
let scores = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
    introversion_extraversion: 0,
    sensing_intuition: 0,
    thinking_feeling: 0,
    judging_perceiving: 0
};

function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(button);
    });

    // Reset buttons visibility
    updateButtonsVisibility();
    updateProgressBar();
}

function selectOption(selectedIndex) {
    selectedAnswer = selectedIndex;

    // Disable other options after selection
    Array.from(optionsContainer.children).forEach((btn, index) => {
        btn.disabled = true;
        if (index === selectedIndex) {
            btn.style.backgroundColor = '#8a2be2'; // Highlight selected answer
            btn.style.color = 'white';
        }
    });

    // Show Next or Submit button
    if (currentQuestionIndex < questions.length - 1) {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    }
}

function updateButtonsVisibility() {
    nextBtn.style.display = selectedAnswer !== null ? 'block' : 'none';
    submitBtn.style.display = currentQuestionIndex === questions.length - 1 && selectedAnswer !== null ? 'block' : 'none';
}

function updateProgressBar() {
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    progress.style.width = `${progressPercentage}%`;
}

nextBtn.addEventListener('click', () => {
    if (selectedAnswer !== null) {
        const currentQuestion = questions[currentQuestionIndex];
        scores[currentQuestion.trait] += currentQuestion.scores[selectedAnswer];

        currentQuestionIndex++;
        selectedAnswer = null;

        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }
});

submitBtn.addEventListener('click', () => {
    if (selectedAnswer !== null) {
        const currentQuestion = questions[currentQuestionIndex];
        scores[currentQuestion.trait] += currentQuestion.scores[selectedAnswer];

        quizSection.style.display = 'none';
        resultSection.style.display = 'block';

        // Analyze results
        const personalityType = getMBTIPersonalityType();
        const careerSuggestions = getCareerSuggestions(personalityType);

        let result = `<p class="result-title">نمط شخصيتك هو: ${personalityType} 🌟</p>`;
        result += `<div class="personality-icon">${getPersonalityIcon(personalityType)}</div>`;
        result += `<p><strong>تحليل شخصيتك:</strong> ${getDetailedAnalysis(personalityType)} 😊</p>`;
        result += `<p><strong>الأعمال المناسبة لشخصيتك:</strong> ${careerSuggestions} 💼</p>`;

        resultText.innerHTML = result;

        // Add dynamic animations
        setTimeout(() => {
            document.querySelector('.personality-icon').classList.add('bounce');
        }, 500);
    }
});

// Initialize the quiz
loadQuestion();

// Helper functions
function getMBTIPersonalityType() {
    const introverted = scores.introversion_extraversion < 1 ? "I" : "E";
    const sensing = scores.sensing_intuition < 1 ? "S" : "N";
    const thinking = scores.thinking_feeling < 1 ? "T" : "F";
    const judging = scores.judging_perceiving < 1 ? "J" : "P";

    return `${introverted}${sensing}${thinking}${judging}`;
}

function getDetailedAnalysis(personalityType) {
    const analysis = {
        "ISTJ": `
            أنت شخص عملي ومنظم. تفضل الالتزام بالقواعد والخطط.
            لديك قدرة عالية على التركيز في التفاصيل وتنفيذ المهام بدقة.
            قد تكون صارمًا في بعض الأحيان، لكنك تُعتمد عليك دائمًا.`,
        "ISFJ": `
            أنت شخص دافئ ومسؤول. تهتم برفاهية الآخرين وتفضل الاستقرار.
            لديك قدرة كبيرة على تقديم الدعم العاطفي للآخرين.
            قد تكون خجولًا بعض الشيء، لكنك تملك قلبًا كبيرًا.`,
        "INFJ": `
            أنت شخص مبدع وملهم. لديك رؤية طويلة الأمد وتهتم بالعلاقات العميقة.
            تحب التفكير في المستقبل وتحقيق الأهداف الكبيرة.
            قد تكون حساسًا جدًا، لكنك تملك قدرة فريدة على التأثير في الآخرين.`,
        "INTJ": `
            أنت شخص استراتيجي ومبتكر. تحب التخطيط للمستقبل وتحقيق الأهداف.
            لديك عقل منطقي وتحليلي، وتفضل العمل بمفردك.
            قد تكون مباشرًا جدًا، لكنك تملك رؤية واضحة لما تريد تحقيقه.`,
        // ... (باقي التحليلات)
    };
    return analysis[personalityType] || "لم يتم العثور على تحليل لنمط شخصيتك.";
}

function getCareerSuggestions(personalityType) {
    const careers = {
        "ISTJ": "محاسب، مهندس، مدير مشروع، معلم.",
        "ISFJ": "ممرض، مستشار اجتماعي، معلم، مساعد إداري.",
        "INFJ": "كاتب، مستشار نفسي، مصمم جرافيك، معلم.",
        "INTJ": "مهندس، محلل بيانات، مدير استراتيجية، باحث.",
        // ... (باقي الاقتراحات)
    };
    return careers[personalityType] || "لم يتم العثور على اقتراحات مهنية لنمط شخصيتك.";
}

function getPersonalityIcon(personalityType) {
    const icons = {
        "ISTJ": "📋", // منظم ومنضبط
        "ISFJ": "❤️", // دافئ ومسؤول
        "INFJ": "✨", // ملهم ومبدع
        "INTJ": "🧠", // استراتيجي ومبتكر
        // ... (باقي الرموز)
    };
    return icons[personalityType] || "❓";
}