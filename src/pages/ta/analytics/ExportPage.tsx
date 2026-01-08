import { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Label } from '@/components/common/Label';
import { Badge } from '@/components/common/Badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/Select';

// Mock 데이터
const mockReportTypes = [
  { id: 'users', name: '사용자 현황', description: '등록된 사용자 목록 및 상태' },
  { id: 'courses', name: '강좌 현황', description: '강좌 목록 및 수강 통계' },
  { id: 'learning', name: '학습 진도', description: '사용자별 학습 진행 현황' },
  { id: 'completion', name: '수료 현황', description: '강좌별 수료자 통계' },
  { id: 'engagement', name: '참여도 분석', description: '사용자 활동 및 참여 지표' },
];

const mockExportHistory: {
  id: number;
  reportType: string;
  format: string;
  period: string;
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
  createdAt: string;
  fileSize?: string;
}[] = [
  { id: 1, reportType: '학습 진도', format: 'XLSX', period: '2025-12', status: 'COMPLETED', createdAt: '2025-12-30 09:15', fileSize: '2.4 MB' },
  { id: 2, reportType: '사용자 현황', format: 'CSV', period: '2025-12', status: 'COMPLETED', createdAt: '2025-12-29 14:30', fileSize: '1.2 MB' },
  { id: 3, reportType: '수료 현황', format: 'XLSX', period: '2025-Q4', status: 'PROCESSING', createdAt: '2025-12-30 10:00' },
  { id: 4, reportType: '참여도 분석', format: 'PDF', period: '2025-12', status: 'FAILED', createdAt: '2025-12-28 16:45' },
];

const statusConfig = {
  COMPLETED: { label: '완료', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  PROCESSING: { label: '처리중', icon: Clock, color: 'bg-blue-100 text-blue-700' },
  FAILED: { label: '실패', icon: AlertCircle, color: 'bg-red-100 text-red-700' },
};

export function ExportPage() {
  const [selectedReport, setSelectedReport] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('xlsx');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  return (
    <div className="p-6">
      <AdminPageHeader
        title="통계 조회 및 내보내기"
        description="분석 데이터를 다양한 형식으로 내보낼 수 있습니다"
      />

      <div className="grid grid-cols-3 gap-6">
        {/* Export Form */}
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>리포트 생성</CardTitle>
              <CardDescription>내보내기할 리포트 유형과 옵션을 선택하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Type Selection */}
              <div className="space-y-2">
                <Label>리포트 유형</Label>
                <div className="grid grid-cols-2 gap-3">
                  {mockReportTypes.map((report) => (
                    <div
                      key={report.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedReport === report.id
                          ? 'border-brand-primary bg-brand-primary/5'
                          : 'hover:bg-bg-secondary'
                      }`}
                      onClick={() => setSelectedReport(report.id)}
                    >
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-text-secondary">{report.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>파일 형식</Label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                      <SelectItem value="csv">CSV (.csv)</SelectItem>
                      <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>기간</Label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">최근 1주</SelectItem>
                      <SelectItem value="month">최근 1개월</SelectItem>
                      <SelectItem value="quarter">최근 분기</SelectItem>
                      <SelectItem value="year">최근 1년</SelectItem>
                      <SelectItem value="all">전체</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button disabled={!selectedReport} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                리포트 생성
              </Button>
            </CardContent>
          </Card>

          {/* Export History */}
          <Card>
            <CardHeader>
              <CardTitle>내보내기 이력</CardTitle>
              <CardDescription>최근 생성한 리포트 목록입니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockExportHistory.map((item) => {
                  const config = statusConfig[item.status];
                  const StatusIcon = config.icon;

                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-bg-secondary rounded-lg">
                          {item.format === 'XLSX' ? (
                            <FileSpreadsheet className="h-5 w-5 text-green-600" />
                          ) : item.format === 'CSV' ? (
                            <FileText className="h-5 w-5 text-blue-600" />
                          ) : (
                            <FileText className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{item.reportType}</p>
                          <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <span>{item.format}</span>
                            <span>•</span>
                            <span>{item.period}</span>
                            <span>•</span>
                            <span>{item.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={config.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                        {item.status === 'COMPLETED' && (
                          <>
                            <span className="text-sm text-text-secondary">{item.fileSize}</span>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>빠른 내보내기</CardTitle>
              <CardDescription>자주 사용하는 리포트</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                이번 달 학습 현황
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                전체 사용자 목록
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                수료 현황 요약
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>내보내기 통계</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-text-secondary">이번 달 생성</span>
                <span className="font-medium">12건</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">총 용량</span>
                <span className="font-medium">45.8 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">가장 많이 생성</span>
                <span className="font-medium">학습 진도</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
