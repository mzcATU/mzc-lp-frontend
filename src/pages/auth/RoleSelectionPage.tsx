import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Shield, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/store/common/authStore';

// 카드 데이터 타입
interface CardData {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  themeColor: 'blue' | 'purple' | 'green' | 'orange';
  delay: number;
  path: string;
  roles: string[]; // 이 카드를 표시할 역할들
}

// 전체 카드 설정 데이터 (학습자 / 관리자 2개로 구분)
const ALL_CARD_DATA: CardData[] = [
  {
    id: 'user',
    title: '학습자 모드',
    description: '교육 프로그램에 참여하고, 나의 학습 현황을 확인하세요.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    icon: <GraduationCap size={32} className="text-blue-400" />,
    themeColor: 'blue',
    delay: 0.3,
    path: '/tu/b2c',
    roles: ['USER'],
  },
  {
    id: 'admin',
    title: '관리자 모드',
    description: '교육 과정 운영, 강의 제작, 사용자 관리 등 관리 기능을 사용하세요.',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    icon: <Shield size={32} className="text-purple-400" />,
    themeColor: 'purple',
    delay: 0.35,
    path: '/ta/dashboard',
    roles: ['TENANT_ADMIN', 'SYSTEM_ADMIN', 'OPERATOR', 'INSTRUCTOR', 'DESIGNER'],
  },
];

// 카드 컴포넌트 Props
interface SelectionCardProps {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  onClick: () => void;
  delay: number;
  themeColor: 'blue' | 'purple' | 'green' | 'orange';
}

function SelectionCard({
  title,
  description,
  image,
  icon,
  onClick,
  delay,
  themeColor,
}: SelectionCardProps) {
  const accentClasses = {
    blue: 'group-hover:shadow-blue-500/20 group-hover:border-blue-500/50',
    purple: 'group-hover:shadow-purple-500/20 group-hover:border-purple-500/50',
    green: 'group-hover:shadow-green-500/20 group-hover:border-green-500/50',
    orange: 'group-hover:shadow-orange-500/20 group-hover:border-orange-500/50',
  }[themeColor];

  const buttonClasses = {
    blue: 'bg-blue-600 hover:bg-blue-500',
    purple: 'bg-purple-600 hover:bg-purple-500',
    green: 'bg-green-600 hover:bg-green-500',
    orange: 'bg-orange-600 hover:bg-orange-500',
  }[themeColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex-1 group cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`relative h-full bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden transition-all duration-500 ${accentClasses} hover:shadow-2xl hover:-translate-y-2`}
      >
        {/* Image Background with Gradient Overlay */}
        <div className="absolute inset-0 h-48 md:h-64 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/80 to-slate-900" />
        </div>

        {/* Content */}
        <div className="relative pt-40 md:pt-56 px-6 pb-8 md:px-8 md:pb-10 flex flex-col h-full">
          <div className="mb-4 p-3 bg-slate-800/80 backdrop-blur-md rounded-2xl w-fit border border-slate-700 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-white/90 transition-colors">
            {title}
          </h3>

          <p className="text-slate-400 mb-8 flex-grow leading-relaxed">{description}</p>

          <div className="flex items-center gap-2 font-medium text-white group/btn">
            <span
              className={`px-6 py-3 rounded-xl ${buttonClasses} transition-all duration-300 shadow-lg`}
            >
              시작하기
            </span>
            <span className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:border-slate-600 transition-colors">
              <ArrowRight
                size={20}
                className="group-hover/btn:translate-x-1 transition-transform"
              />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function RoleSelectionPage() {
  const navigate = useNavigate();
  const { subdomain } = useParams<{ subdomain: string }>();
  const user = useAuthStore((state) => state.user);

  const prefixPath = (path: string) => {
    if (subdomain) {
      return `/${subdomain}${path}`;
    }
    return path;
  };

  // 사용자 역할에 맞는 카드만 필터링
  const availableCards = useMemo(() => {
    const userRoles = user?.roles || [];
    return ALL_CARD_DATA.filter(card =>
      card.roles.some(role => userRoles.includes(role as typeof userRoles[number]))
    );
  }, [user?.roles]);

  const handleSelect = (card: CardData) => {
    navigate(prefixPath(card.path));
  };

  const userName = user?.name || '사용자';

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="z-10 text-center mb-12 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-slate-300 backdrop-blur-sm inline-flex items-center gap-2">
            <Sparkles size={14} className="text-purple-400" />
            MZC Learn Platform
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400"
        >
          안녕하세요, {userName}님
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 max-w-lg mx-auto"
        >
          이동하고자 하는 페이지를 선택해주세요.
        </motion.p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl z-10">
        {availableCards.map((card, index) => (
          <SelectionCard
            key={card.id}
            title={card.title}
            description={card.description}
            image={card.image}
            icon={card.icon}
            onClick={() => handleSelect(card)}
            delay={0.3 + index * 0.1}
            themeColor={card.themeColor}
          />
        ))}
      </div>
    </div>
  );
}
