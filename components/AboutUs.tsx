
import React from 'react';
import ScrollReveal from './ScrollReveal';

interface AboutUsProps {
  isDarkMode?: boolean;
}

const AboutUs: React.FC<AboutUsProps> = ({ isDarkMode = false }) => {
  const values = [
    {
      title: "ተደራሽነት (Accessibility)",
      desc: "በየትኛውም የዓለም ክፍል የሚገኙ ኢትዮጵያውያን ተወዳጅ መጻሕፍቶቻቸውን በቀላሉ እንዲያገኙ እናደርጋለን።",
      icon: "🌍"
    },
    {
      title: "ባህልን መጠበቅ (Cultural Preservation)",
      desc: "የኢትዮጵያን ጥንታዊ እና ዘመናዊ ስነ-ጽሁፎች ለቀጣዩ ትውልድ በዲጂታል መልክ ጠብቆ ማቆየት ዓላማችን ነው።",
      icon: "🏛️"
    },
    {
      title: "ጥራት (Quality)",
      desc: "ለአንባቢዎቻችን ምቹ እና ጥራት ያለው የንባብ ልምድ ለማቅረብ ዘመናዊ ቴክኖሎጂዎችን እንጠቀማለን።",
      icon: "⭐"
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-black mb-6">ስለ አዋሽ ዲጂታል መጻሕፍት</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              የኢትዮጵያ ስነ-ጽሁፍን ከዘመናዊው ዓለም ጋር የምናስተሳስርበት ድልድይ ነን። 
              ንባብን ለማቅለል እና እውቀትን ለማሰራጨት እንሰራለን።
            </p>
          </ScrollReveal>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <ScrollReveal>
            <h2 className={`text-3xl font-black mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>ታሪካችን (Our Story)</h2>
            <div className={`space-y-4 text-lg leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <p>
                አዋሽ ዲጂታል መጻሕፍት መደብር የተመሰረተው አንባቢያን እና ጸሃፊያንን በቴክኖሎጂ ለማገናኘት ባለን ራዕይ ነው። 
                ብዙዎቻችን የምንወዳቸውን መጻሕፍት ማግኘት በሚከብደን ጊዜ መፍትሔ እንዲሆን ታስቦ የተፈጠረ ነው።
              </p>
              <p>
                ስሙን "አዋሽ" ያልንበት ምክንያት እንደ አዋሽ ወንዝ የማይደርቅ የእውቀት ምንጭ ለመሆን ስለምንመኝ ነው። 
                ከጥንታዊ ስራዎች እስከ ዘመናዊ የልብ ወለድ እና የፍልስፍና ስራዎች በስብስባችን ውስጥ ይገኛሉ።
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="relative group">
              <div className="absolute -inset-4 bg-blue-600/20 rounded-3xl blur-xl group-hover:bg-blue-600/30 transition-all duration-500"></div>
              <img 
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop" 
                alt="Books background" 
                className="relative rounded-3xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
          </ScrollReveal>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <ScrollReveal className={`p-10 rounded-3xl border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-sm'}`}>
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6">🎯</div>
            <h3 className={`text-2xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>ተልዕኳችን (Mission)</h3>
            <p className={`leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              ለሁሉም አንባቢ ጥራት ያላቸውን መጻሕፍት በየትኛውም ሰዓት እና ቦታ በቀላሉ እንዲያገኝ ማስቻል። 
              ጸሃፊያንም ስራዎቻቸው ለአንባቢ በቀላሉ እንዲደርሱላቸው ምቹ መድረክ መፍጠር።
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200} className={`p-10 rounded-3xl border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-sm'}`}>
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6">👁️</div>
            <h3 className={`text-2xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>ራዕያችን (Vision)</h3>
            <p className={`leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              በአፍሪካ ቀዳሚው እና ትልቁ የዲጂታል ቤተ-መጻሕፍት እና የመጻሕፍት መደብር መሆን። 
              የንባብ ባህል በህብረተሰባችን ውስጥ እንዲዳብር የበኩላችንን ድርሻ መወጣት።
            </p>
          </ScrollReveal>
        </div>

        {/* Values */}
        <div className="text-center mb-12">
          <ScrollReveal>
            <h2 className={`text-3xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>እሴቶቻችን (Our Values)</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <ScrollReveal key={i} delay={i * 100} className={`p-8 rounded-2xl border text-center transition-all hover:-translate-y-2 ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-blue-500' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl'}`}>
              <div className="text-4xl mb-4">{v.icon}</div>
              <h4 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{v.title}</h4>
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{v.desc}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className={`py-20 px-4 transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-blue-50'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className={`text-3xl font-black mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>ሊያገኙን ይፈልጋሉ?</h2>
            <p className={`mb-10 text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              ማንኛውም ጥያቄ ወይም አስተያየት ካለዎት እኛን ለማነጋገር አያመንቱ። የደንበኞች አገልግሎታችን ዘወትር ዝግጁ ነው።
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:info@awashdigital.com" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30">
                ኢሜይል ይላኩልን
              </a>
              <button className={`px-8 py-3 font-bold rounded-xl border transition-all ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-white'}`}>
                በስልክ ያነጋግሩን
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
