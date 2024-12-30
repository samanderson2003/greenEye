import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';


// Translation resources
const resources = {
  en: {
    translation: {
      home: {
        title: "Home",
        welcome: "Welcome to the App!",
        weather: "Current Weather",
        diagnosisTitle: "Diagnosis Report",
        diseaseTitle: "Livestock Disease Suggestions",
        tipsTitle: "Tips for Plants and Livestock",
        tipsLivestocks: "Unlock the secrets of natural farming and traditional solutions to ensure healthy livestock.",
        tipsChart: "Discover the bigger picture with interactive charts showing the health trends of your region's livestock.",
        tipsBot: "Upload images or descriptions and get instant, AI-powered health insights for your livestock.",
        tipsCrops: "Empower your fields with AI - detect crop diseases early and take preventive action.",
      },
      detection: {
        title: "Detection",
        detectionTitle: "Plant disease detection",
        info: "How to Detect Infections",
        scan: "Open Scan",
      },
      question: {
        title: "Livestock Health Assessment",
        selectLivestocks: "Select your Cattle",
        yes: "Yes",
        no: "No",
      },
      community: {
        title: "Community Chat",
      },
      profile: {
        title: "Farmer Profile",
        date: "Date Joined",
        locationTitle: "Location (State)",
        languageTitle: "Preferred Language",
        edit: "Edit Profile",
        logoutTitle: "Logout",
      },
      chatBot: {
        header: "Report to analyse external diseases."
      }
    },
  },
  hi: {
    translation: {
      home: {
        title: "मुख्य पृष्ठ",
        welcome: "ऐप में आपका स्वागत है!",
        weather: "वर्तमान मौसम",
        diagnosisTitle: "निदान रिपोर्ट",
        diseaseTitle: "पशुधन रोग सुझाव",
        tipsTitle: "पौधों और पशुओं के लिए सुझाव",
        tipsLivestocks: "स्वस्थ पशुधन और भरपूर फसल सुनिश्चित करने के लिए प्राकृतिक खेती और पारंपरिक समाधानों के रहस्यों को जानें।",
        tipsChart: "अपने क्षेत्र के पशुधन के स्वास्थ्य प्रवृत्तियों को दिखाने वाले इंटरैक्टिव चार्ट्स के साथ बड़ी तस्वीर खोजें।",
        tipsBot: "चित्र या विवरण अपलोड करें और अपने पशुधन के लिए त्वरित, एआई-समर्थित स्वास्थ्य अंतर्दृष्टि प्राप्त करें।",
        tipsCrops: "अपने खेतों को एआई से सशक्त करें - फसल रोगों का जल्दी पता लगाएं और रोकथाम करें।",
      },
      detection: {
        title: "पता लगाना",
        detectionTitle: "पौधों की बीमारी का पता लगाना",
        info: "संक्रमण का पता कैसे लगाएं",
        scan: "स्कैन खोलें",
      },
      question: {
        title: "पशुधन स्वास्थ्य आकलन",
        selectLivestocks: "अपने मवेशी का चयन करें",
        yes: "हां",
        no: "नहीं",
      },
      community: {
        title: "सामुदायिक चैट",
      },
      profile: {
        title: "किसान प्रोफ़ाइल",
        date: "शामिल होने की तारीख",
        locationTitle: "स्थान (राज्य)",
        languageTitle: "पसंदीदा भाषा",
        edit: "प्रोफ़ाइल संपादित करें",
        logoutTitle: "लॉगआउट",
      },
      chatBot: {
        header: "बाहरी रोगों का विश्लेषण करने के लिए रिपोर्ट करें।"
      }
    },
  },
  ta: {
    translation: {
      home: {
        title: "முகப்பு",
        welcome: "ஆப்பிற்கு வரவேற்கின்றோம்!",
        weather: "தற்போதைய காலநிலை",
        diagnosisTitle: "நோயாளி அறிக்கை",
        diseaseTitle: "மாடுகள் நோய் பரிந்துரைகள்",
        tipsTitle: "செயற்கை மற்றும் இயற்கை விவசாய குறிப்புகள்",
        tipsLivestocks: "இயற்கை விவசாயத்தின் ரகசியங்களைத் திறந்து, ஆரோக்கியமான மாடுகள் மற்றும் வளமான பயிர்களை உறுதிசெய்யவும்.",
        tipsChart: "உங்கள் பகுதிக்கு ஏற்ற மாடுகளின் ஆரோக்கியத்தை காட்டும் இடைமுக விளக்கப்படங்களை கண்டறியுங்கள்.",
        tipsBot: "படங்களை அல்லது விளக்கங்களை பதிவேற்றுங்கள் மற்றும் உங்கள் மாடுகளுக்கான எளிய, செயற்கை நுண்ணறிவு ஆதரவு ஆரோக்கிய கருத்துகளைப் பெறுங்கள்.",
        tipsCrops: "உங்கள் நிலங்களை சாத்தியமாக்குங்கள் – பயிர் நோய்களை முன்னே கண்டறியுங்கள் மற்றும் தடுப்பு நடவடிக்கைகள் மேற்கொள்ளுங்கள்.",
      },
      detection: {
        title: "கண்டறிதல்",
        detectionTitle: "தாவர நோய் கண்டறிதல்",
        info: "தொற்றுகளை கண்டறிதல் எப்படி",
        scan: "ஸ்கேன் திறக்க",
      },
      question: {
        title: "மாடுகளை ஆரோக்கிய மதிப்பீடு",
        selectLivestocks: "உங்கள் மாடுகளைத் தேர்வுசெய்க",
        yes: "ஆம்",
        no: "இல்லை",
      },
      community: {
        title: "சமூக உரையாடல்",
      },
      profile: {
        title: "விவசாயி சுயவிவரப் பதிவு",
        date: "சேர்ந்த தேதி",
        locationTitle: "இடம் (மாநிலம்)",
        languageTitle: "முன்னிலை மொழி",
        edit: "சுயவிவரத்தைத் திருத்து",
        logoutTitle: "வெளியேறு",
      },
      chatBot: {
        header: "வெளிப்புற நோய்களை பகுப்பாய்வு செய்ய அறிக்கை."
      }
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes strings to prevent XSS
  },
});

export default i18n;

