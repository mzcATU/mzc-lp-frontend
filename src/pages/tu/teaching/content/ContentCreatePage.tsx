import { useNavigate } from 'react-router-dom';
import { ContentRegistrationWizard } from '@/components/domain/content';
import type { LOData } from '@/types';
import { useUploadContent, useCreateExternalLink } from '@/hooks/tu';

export function ContentCreatePage() {
  const navigate = useNavigate();
  const uploadContent = useUploadContent();
  const createExternalLink = useCreateExternalLink();

  const handleBack = () => {
    navigate('/tu/teaching/content');
  };

  const handleSave = async (data: LOData) => {
    try {
      if (data.loType === 'external-link' && data.externalUrl) {
        // 외부 링크 생성
        await createExternalLink.mutateAsync({
          externalUrl: data.externalUrl,
        });
      } else if (data.uploadedFile) {
        // 파일 업로드
        await uploadContent.mutateAsync({
          file: data.uploadedFile,
        });
      }

      alert('콘텐츠가 등록되었습니다.');
      navigate('/tu/teaching/content');
    } catch (error) {
      console.error('콘텐츠 등록 실패:', error);
      alert('콘텐츠 등록에 실패했습니다.');
    }
  };

  return <ContentRegistrationWizard onBack={handleBack} onSave={handleSave} />;
}
