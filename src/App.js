import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Gift, ArrowRight, MessageCircle, X, Clock, Star, TrendingUp, Award, FileText, Video } from 'lucide-react';

const VectorCourseLanding = () => {
  // --- TELEGRAM БАПТАУЛАРЫ ---
  const TELEGRAM_BOT_TOKEN = '8555218977:AAFD-LW5R_Bl7AyENdykBXywn1_J6wcVWlA';
  const TELEGRAM_CHAT_ID = '872495346';

  // --- STATES ---
  const [isRegistered, setIsRegistered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  
  // Тест логикасы
  const [step, setStep] = useState('video_section'); 
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  // Анимация
  const [showPainPoints, setShowPainPoints] = useState(false);

  // --- ТАЙМЕРДІ ӨЗГЕРТТІМ (25 МИНУТ) ---
  const [timeLeft, setTimeLeft] = useState(25 * 60); 

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    grade: '11-сынып',
    status: 'Өзім дайындалып жүрмін'
  });

  const whatsappNumber = "77755851203"; 

  // --- OQUWSHYLAR RESULTATY ---
  const fakeResults = [
    { name: "Айғаным Б.", score: "50/50", uni: "SDU", color: "bg-blue-100 text-blue-700" },
    { name: "Ерасыл К.", score: "45/50", uni: "KBTU", color: "bg-green-100 text-green-700" },
    { name: "Нұрай А.", score: "48/50", uni: "ENU", color: "bg-purple-100 text-purple-700" },
    { name: "Бекзат Т.", score: "49/50", uni: "KazNU", color: "bg-orange-100 text-orange-700" },
  ];

  // --- СҰРАҚТАР ---
  const questions = [
    {
      question: "Вектор дегеніміз не?",
      options: ["Бағытталған кесінді", "Түзу сызық", "Нүктелер жиыны", "Кесінді"],
      correct: 0
    },
    {
      question: "a(2; 3) және b(4; 1) векторларының қосындысы?",
      options: ["(6; 4)", "(2; -2)", "(8; 3)", "(6; 2)"],
      correct: 0
    },
    {
      question: "Коллинеар векторлар деген не?",
      options: ["Перпендикуляр", "Бір түзуде немесе параллель жатқан", "Тең векторлар", "Нөлдік"],
      correct: 1
    },
    {
      question: "Скаляр көбейтінді формуласы?",
      options: ["|a|*|b|*cosα", "|a|+|b|", "|a|*|b|*sinα", "a*b"],
      correct: 0
    },
    {
      question: "Вектордың ұзындығы қалай табылады?",
      options: ["Координата қосындысы", "Координата квадраттарының түбірі", "Көбейтінді", "Белгісіз"],
      correct: 1
    }
  ];

  // --- PAIN POINTS ---
  const painPoints = [
    "Векторлардың бағытын үнемі шатастырамын...",
    "Скаляр көбейтінді формуласы есімнен шыға береді",
    "Координаталармен есеп шығарғанда қате жіберемін",
    "ҰБТ-да осы тақырып келсе, 'өткізіп жіберемін' деп қорқамын"
  ];

  // --- EFFECTS ---
  useEffect(() => {
    setTimeout(() => setShowPainPoints(true), 500);
    if (isRegistered && timeLeft > 0) {
      const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timerId);
    }
  }, [isRegistered, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m} : ${s < 10 ? '0' : ''}${s}`;
  };

  // --- TELEGRAM-ҒА ЖІБЕРУ ---
  const sendToTelegram = async (data) => {
    const text = `
🔥 <b>ЖАҢА ЛИД! (Math Hack)</b>

👤 <b>Аты:</b> ${data.name}
📞 <b>Телефон:</b> ${data.phone}
🎓 <b>Сыныбы:</b> ${data.grade}
    `;

    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: 'HTML',
        }),
      });
      console.log("Telegram-ға кетті!");
    } catch (error) {
      console.error("Telegram қатесі:", error);
    }
  };

  // --- HANDLERS ---
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    let formattedValue = '';
    if (value.length > 0) {
      formattedValue = '+7';
      if (value.length > 1) formattedValue += ' (' + value.slice(1, 4);
      if (value.length >= 5) formattedValue += ') ' + value.slice(4, 7);
      if (value.length >= 8) formattedValue += '-' + value.slice(7, 9);
      if (value.length >= 10) formattedValue += '-' + value.slice(9, 11);
    }
    setFormData({ ...formData, phone: formattedValue });
    setPhoneError('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.phone.length < 18) {
        setPhoneError('Нөмірді толық жазыңыз');
        return;
    }
    
    // Telegram-ға жіберу
    sendToTelegram(formData);

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowModal(false);
      setIsRegistered(true);
      window.scrollTo(0, 0); 
    }, 1500);
  };

  const handleAnswer = (index) => {
    if (index === questions[currentQuestion].correct) setScore(score + 1);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('result');
      window.scrollTo(0, 0);
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* 1-БӨЛІМ: LANDING PAGE */}
      {!isRegistered && (
        <div className="max-w-md mx-auto min-h-screen relative pb-20">
          <div className="p-5 flex justify-center items-center bg-white z-10 sticky top-0">
            <h1 className="text-2xl font-black text-emerald-600 uppercase tracking-tighter">MATH HACK</h1>
          </div>

          <div className="px-5 flex flex-col items-center">
            
            <div className="relative w-64 h-64 mb-6 mt-4">
               <div className="w-full h-full rounded-full border-4 border-emerald-500 p-1 shadow-2xl overflow-hidden">
                 <img src="/api/placeholder/400/400" alt="Қазбек ағай" className="w-full h-full object-cover rounded-full"/>
               </div>
               <div className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-full shadow-md border border-gray-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-bold text-gray-600">Online</span>
               </div>
            </div>

            <h2 className="text-3xl font-extrabold text-center text-gray-900 leading-none mb-6">
              ВЕКТОРДЫ <span className="text-emerald-600">ОҢАЙ</span> ТҮСІН
            </h2>

            <button 
              onClick={() => setShowModal(true)}
              className="w-full bg-[#00C853] hover:bg-[#00a844] text-white font-bold py-4 rounded-xl text-xl shadow-[0_10px_20px_rgba(0,200,83,0.3)] animate-bounce mb-12"
            >
              Тіркеліп үлгеремін! 🚀
            </button>

            <div className={`transition-all duration-1000 ${showPainPoints ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <p className="text-center text-gray-400 font-bold text-sm uppercase mb-4 tracking-widest">Таныс жағдай ма?</p>
              <div className="space-y-3 mb-8 w-full">
                {painPoints.map((text, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-xl border-l-4 border-red-400 shadow-sm flex items-start gap-3 transform hover:scale-105 transition-transform" style={{ animationDelay: `${index * 200}ms` }}>
                    <X className="text-red-400 shrink-0 mt-1" size={20} />
                    <p className="text-sm font-medium text-gray-700">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setShowModal(true)} className="w-full border-2 border-[#00C853] text-[#00C853] font-bold py-3 rounded-xl text-lg mb-12 hover:bg-emerald-50 transition-colors">
              Иә, бұл мен туралы 😓
            </button>

            <div className="w-full bg-gray-900 text-white rounded-3xl p-6 relative overflow-hidden mb-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Star className="text-yellow-400 fill-yellow-400" size={20}/> Спикер туралы</h3>
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl">🎓</div>
                  <div><p className="font-bold text-lg">SDU Түлегі & Магистрі</p><p className="text-gray-400 text-xs">Ең үздік IT және Педагогикалық университет</p></div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl">⏳</div>
                   <div><p className="font-bold text-lg">5 Жылдық Тәжірибе</p><p className="text-gray-400 text-xs">Математиканы "шемішкедей" шағамыз</p></div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl">👥</div>
                   <div><p className="font-bold text-lg">2000+ Оқушы</p><p className="text-gray-400 text-xs">Көпшілігі Грант иегері</p></div>
                </div>
              </div>
              <button onClick={() => setShowModal(true)} className="w-full bg-white text-gray-900 font-bold py-4 rounded-xl mt-8 shadow-lg flex justify-center items-center gap-2 hover:bg-gray-100 transition-colors">
                Қазбек ағайдың сабағын көру <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2-БӨЛІМ: МОДАЛЬ (ФОРМА) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><X size={24} /></button>

            {showSuccess ? (
               <div className="text-center py-12">
                 <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                   <CheckCircle className="text-emerald-600 w-12 h-12" />
                 </div>
                 <h3 className="text-2xl font-bold text-gray-800">Сәтті тіркелдіңіз!</h3>
                 <p className="text-gray-500 mt-2">Сабаққа өтудеміз...</p>
               </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Сабақты ашу 🔓</h3>
                    <p className="text-xs text-gray-500 px-4">Деректеріңізді толтырған соң, видео бірден ашылады</p>
                </div>
                <div className="space-y-4">
                    <input required type="text" placeholder="Атыңыз (Мысалы: Бекзат)" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}/>
                    <div>
                        <input required type="tel" placeholder="+7 (___) ___-__-__" className={`w-full p-4 bg-gray-50 border rounded-xl focus:ring-2 outline-none font-medium ${phoneError ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-emerald-500'}`} value={formData.phone} onChange={handlePhoneChange} maxLength={18} />
                        {phoneError && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{phoneError}</p>}
                    </div>
                    
                    <div>
                        <p className="text-sm font-bold text-gray-700 mb-2 ml-1">Қай сынып оқушысысың?</p>
                        <div className="grid grid-cols-3 gap-2">
                            {['9', '10', '11'].map((cls) => (
                                <label key={cls} className={`text-center py-3 rounded-xl border cursor-pointer transition-all ${formData.grade === `${cls}-сынып` ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white border-gray-200 text-gray-600'}`}>
                                <input type="radio" name="grade" value={`${cls}-сынып`} checked={formData.grade === `${cls}-сынып`} onChange={(e) => setFormData({...formData, grade: e.target.value})} className="hidden" />
                                <span className="font-bold text-sm">{cls}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <button type="submit" className="w-full bg-[#00C853] hover:bg-[#00a844] text-white font-bold py-4 rounded-xl shadow-lg mt-6 active:scale-95 transition-transform text-lg">ТЕГІН КУРСҚА ӨТУ</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 3-БӨЛІМ: ВИДЕО + ТЕСТ + НӘТИЖЕ */}
      {isRegistered && (
        <div className="max-w-md mx-auto min-h-screen bg-white pb-20">
          
          <div className="pt-8 px-5 pb-4 text-center">
            <h2 className="text-3xl font-black text-gray-900 uppercase leading-none mb-2">ВЕКТОР ТУРАЛЫ <br/> <span className="text-emerald-600">ЛЮБОЙ СҰРАҚҚА</span></h2>
            <div className="bg-gray-100 py-2 px-4 rounded-lg inline-block"><p className="text-sm font-bold text-gray-600">СМЕЛО ЖАУАП БЕРГІҢ КЕЛСЕ,</p><p className="text-xs text-gray-500">бұл видеоны сразу көріп ал!</p></div>
          </div>

          {/* ВИДЕО БӨЛІМІ */}
          {step === 'video_section' && (
            <>
                <div className="w-full aspect-video bg-black shadow-2xl relative group cursor-pointer mb-6">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center animate-pulse"><Play className="text-white fill-white ml-1" size={30} /></div>
                    </div>
                    <img src="/api/placeholder/600/350" alt="Video Poster" className="w-full h-full object-cover opacity-60"/>
                </div>

                <div className="px-5 text-center">
                    <p className="text-emerald-800 font-bold text-sm mb-4">Оқушылардың 80%-ы қадалатын тақырыпты 15 минутта түсіндіріп беремін</p>

                    <button 
                        onClick={() => {
                            setStep('quiz');
                            window.scrollTo(0, 0);
                        }}
                        className="block w-full bg-[#00C853] hover:bg-[#00a844] text-white font-black uppercase py-4 rounded-xl text-xl shadow-[0_8px_0_rgb(0,150,50)] active:shadow-none active:translate-y-2 transition-all mb-8"
                    >
                        тест тапсыру
                    </button>

                    <div className="mb-10">
                        {/* 25 минут таймер */}
                        <div className="text-6xl font-black text-[#004d40] tracking-widest font-mono">{formatTime(timeLeft)}</div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Тегін сабақ жабылғанша қалды</p>
                    </div>

                    <div className="text-left mb-8">
                        <h3 className="font-bold text-lg uppercase mb-4 pl-2 border-l-4 border-emerald-500">Оқушылар нәтижесі</h3>
                        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
                            {fakeResults.map((student, i) => (
                                <div key={i} className="min-w-[160px] bg-white border border-gray-100 shadow-xl rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                                    <Award className="text-yellow-400 mb-2" size={24} />
                                    <h4 className="font-bold text-gray-800">{student.name}</h4>
                                    <p className={`text-xs font-bold px-2 py-0.5 rounded mt-1 ${student.color}`}>{student.uni}</p>
                                    <p className="text-2xl font-black text-emerald-600 mt-2">{student.score}</p>
                                    <p className="text-[10px] text-gray-400">ҰБТ тесті</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
          )}

          {/* ТЕСТ БЛОГЫ */}
          {step === 'quiz' && (
            <div className="p-6 min-h-[50vh] flex flex-col justify-center">
               <div className="mb-8">
                 <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                    <span>СҰРАҚ</span>
                    <span>{currentQuestion + 1} / 5</span>
                 </div>
                 <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all duration-300" style={{width: `${((currentQuestion+1)/5)*100}%`}}></div>
                 </div>
               </div>
               <h3 className="text-xl font-bold mb-8 leading-relaxed">{questions[currentQuestion].question}</h3>
               <div className="space-y-3">
                 {questions[currentQuestion].options.map((opt, i) => (
                   <button key={i} onClick={() => handleAnswer(i)} className="w-full p-4 text-left border-2 border-gray-100 rounded-xl font-bold text-gray-700 hover:border-emerald-500 hover:bg-emerald-50 active:scale-95 transition-all shadow-sm">
                     {opt}
                   </button>
                 ))}
               </div>
            </div>
          )}

          {/* НӘТИЖЕ ЖӘНЕ СЫЙЛЫҚТАР */}
          {step === 'result' && (
            <div className="p-6 pt-10">
              <div className="text-center mb-8">
                  <div className="inline-block p-4 bg-emerald-100 rounded-full mb-4 animate-bounce"><Gift className="w-12 h-12 text-emerald-600" /></div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">ҚҰТТЫҚТАЙМЫН!</h2>
                  <p className="text-gray-500">Сенің тест нәтижең: <span className="text-emerald-600 font-bold text-xl">{score}/5</span></p>
              </div>

              {/* СЫЙЛЫҚТАР ТІЗІМІ */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden mb-6">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
                 <h3 className="font-bold text-lg mb-4 border-b border-gray-700 pb-2">🎁 СЕНІҢ СЫЙЛЫҚТАРЫҢ:</h3>
                 <ul className="space-y-4 relative z-10">
                    
                    {/* 15% ЖЕҢІЛДІК */}
                    <li className="flex items-center gap-4 bg-yellow-500/20 p-3 rounded-xl border border-yellow-500/50">
                       <div className="bg-yellow-500 p-2 rounded-lg"><Star size={20} className="text-black fill-black"/></div>
                       <div><p className="font-bold text-sm text-yellow-400">15% Жеңілдік ұтып алдың</p><p className="text-xs text-gray-300">Толық дайындық курсына</p></div>
                    </li>

                    <li className="flex items-center gap-4 bg-white/10 p-3 rounded-xl">
                       <div className="bg-emerald-500 p-2 rounded-lg"><Video size={20} className="text-white"/></div>
                       <div><p className="font-bold text-sm">Нұсқа талдау видеосы</p><p className="text-xs text-gray-400">Қиын есептердің шешімі</p></div>
                    </li>

                    <li className="flex items-center gap-4 bg-white/10 p-3 rounded-xl">
                       <div className="bg-emerald-500 p-2 rounded-lg"><CheckCircle size={20} className="text-white"/></div>
                       <div><p className="font-bold text-sm">Формула жинақ кітапшасы</p><p className="text-xs text-gray-400">PDF форматында</p></div>
                    </li>
                    
                    <li className="flex items-center gap-4 bg-white/10 p-3 rounded-xl">
                       <div className="bg-emerald-500 p-2 rounded-lg"><FileText size={20} className="text-white"/></div>
                       <div><p className="font-bold text-sm">Жеке дайындық жоспары</p><p className="text-xs text-gray-400">Саған арналған жол картасы</p></div>
                    </li>
                 </ul>
              </div>

              {/* WHATSAPP (СЫЙЛЫҚ СҰРАУ) */}
              <a 
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Сәлем Қазбек ағай! Менің атым ${formData.name}. Вектор сабағын өттім (Тест: ${score}/5). Мен 15% жеңілдік пен сыйлықтарды (Жоспар, Формула, Талдау) алғым келеді!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-xl shadow-lg animate-pulse transform active:scale-95 transition-all"
              >
                <MessageCircle size={24} />
                СЫЙЛЫҚТАРДЫ АЛУ
              </a>
              <p className="text-center text-xs text-gray-400 mt-4 px-8">Түймені басқан соң менің жеке WhatsApp-ыма өтесің, сыйлықтарды сол жерден жіберемін.</p>
              
               {/* Footer Info */}
             <div className="mt-8 text-center opacity-50 pb-8">
                <p className="text-xs">Авторлық курс: Қазбек ағай</p>
                <p className="text-[10px]">Барлық құқықтар қорғалған © 2025</p>
             </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default VectorCourseLanding;