import { useState } from 'react';
import {
  CreditCard,
  Download,
  Users,
  HardDrive,
  BookOpen,
  CheckCircle,
  Calendar,
} from 'lucide-react';
import { AdminPageHeader, PlanBadge } from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Progress } from '@/components/common/Progress';

// Mock 데이터
const mockBillingInfo = {
  plan: {
    name: 'Enterprise',
    status: 'ACTIVE' as const,
    billingCycle: 'YEARLY',
    nextBillingDate: '2026-01-15',
    price: 5000000,
  },
  usage: {
    users: { current: 2500, limit: 5000 },
    storage: { current: 85.2, limit: 100 },
    courses: { current: 45, limit: 100 },
    admins: { current: 8, limit: 10 },
  },
  paymentMethod: {
    type: 'CARD',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: 12,
    expiryYear: 2026,
  },
  invoices: [
    { id: 1, date: '2025-01-15', amount: 5000000, status: 'PAID' },
    { id: 2, date: '2024-01-15', amount: 5000000, status: 'PAID' },
    { id: 3, date: '2023-01-15', amount: 4500000, status: 'PAID' },
  ],
};

export function BillingPage() {
  const [billing] = useState(mockBillingInfo);

  return (
    <div className="p-6">
      <AdminPageHeader
        title="요금제 및 라이선스"
        description="현재 구독 플랜과 사용량을 확인합니다"
        actions={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            청구서 다운로드
          </Button>
        }
      />

      <div className="space-y-6">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>현재 플랜</CardTitle>
                <CardDescription>구독 중인 요금제 정보입니다</CardDescription>
              </div>
              <Button>플랜 업그레이드</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-lg">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{billing.plan.name}</h2>
                  <PlanBadge plan="ENTERPRISE" />
                </div>
                <p className="text-text-secondary mt-1">
                  {billing.plan.billingCycle === 'YEARLY' ? '연간' : '월간'} 구독
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">
                  {billing.plan.price.toLocaleString()}원
                  <span className="text-sm font-normal text-text-secondary">/년</span>
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  다음 결제일: {billing.plan.nextBillingDate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage */}
        <Card>
          <CardHeader>
            <CardTitle>리소스 사용량</CardTitle>
            <CardDescription>현재 플랜의 리소스 사용 현황입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {/* Users */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-brand-primary" />
                  <span className="font-medium">사용자</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{billing.usage.users.current.toLocaleString()} 명</span>
                  <span className="text-text-secondary">/ {billing.usage.users.limit.toLocaleString()} 명</span>
                </div>
                <Progress value={(billing.usage.users.current / billing.usage.users.limit) * 100} />
              </div>

              {/* Storage */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <HardDrive className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">스토리지</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{billing.usage.storage.current} GB</span>
                  <span className="text-text-secondary">/ {billing.usage.storage.limit} GB</span>
                </div>
                <Progress value={(billing.usage.storage.current / billing.usage.storage.limit) * 100} />
              </div>

              {/* Courses */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">강좌</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{billing.usage.courses.current} 개</span>
                  <span className="text-text-secondary">/ {billing.usage.courses.limit} 개</span>
                </div>
                <Progress value={(billing.usage.courses.current / billing.usage.courses.limit) * 100} />
              </div>

              {/* Admins */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="font-medium">관리자</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{billing.usage.admins.current} 명</span>
                  <span className="text-text-secondary">/ {billing.usage.admins.limit} 명</span>
                </div>
                <Progress value={(billing.usage.admins.current / billing.usage.admins.limit) * 100} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          {/* Payment Method */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>결제 수단</CardTitle>
                <Button variant="outline" size="sm">변경</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="p-3 bg-bg-secondary rounded-lg">
                  <CreditCard className="h-6 w-6 text-brand-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {billing.paymentMethod.brand} •••• {billing.paymentMethod.last4}
                  </p>
                  <p className="text-sm text-text-secondary">
                    만료: {billing.paymentMethod.expiryMonth}/{billing.paymentMethod.expiryYear}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>최근 청구서</CardTitle>
                <Button variant="ghost" size="sm">전체 보기</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {billing.invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-text-secondary" />
                      <span>{invoice.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{invoice.amount.toLocaleString()}원</span>
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        결제완료
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
