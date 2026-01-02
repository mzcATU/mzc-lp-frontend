import { useNavigate } from 'react-router-dom';
import { ContentRegistrationWizard } from '@/components/domain/tu/content';
import type { LOData, CompletionCriteria } from '@/types';
import { useUploadContent, useCreateExternalLink } from '@/hooks/tu';

// 프론트 completionCriteria -> 백엔드 enum 변환
const mapCompletionCriteria = (criteria: CompletionCriteria): 'BUTTON_CLICK' | 'PERCENT_90' | 'PERCENT_100' => {
  switch (criteria) {
    case 'button-click':
      return 'BUTTON_CLICK';
    case '90-percent':
      return 'PERCENT_90';
    case '100-percent':
      return 'PERCENT_100';
    default:
      return 'PERCENT_100';
  }
};

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
          url: data.externalUrl,
          name: data.title, // 콘텐츠 제목을 name으로 사용
        });
      } else if (data.uploadedFile) {
        // 파일 업로드 (제목, 설명, 태그, 카테고리, 완료기준, 썸네일, 다운로드 허용 전달)
        await uploadContent.mutateAsync({
          file: data.uploadedFile,
          originalFileName: data.title && data.title !== data.uploadedFile.name ? data.title : undefined,
          description: data.description || undefined,
          tags: data.tags.length > 0 ? data.tags.join(',') : undefined,
          category: data.category || undefined,
          completionCriteria: mapCompletionCriteria(data.completionCriteria),
          thumbnail: data.thumbnailImage,
          downloadable: data.allowDownload,
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
