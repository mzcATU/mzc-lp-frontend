import { useNavigate } from 'react-router-dom';
import { ContentRegistrationWizard } from '@/components/domain/content';
import type { LOData } from '@/types';

export function ContentCreatePage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/tu/teaching/content');
  };

  const handleSave = (data: LOData) => {
    console.log('콘텐츠 저장:', data);
    // TODO: API 호출로 콘텐츠 저장
    alert('콘텐츠가 발행되었습니다.');
    navigate('/tu/teaching/content');
  };

  return <ContentRegistrationWizard onBack={handleBack} onSave={handleSave} />;
}
