import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/common/Dialog';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import type { CreateSystemAdminRequest } from '@/types/admin';

interface CreateSystemAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateSystemAdminRequest) => Promise<void>;
}

export function CreateSystemAdminDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateSystemAdminDialogProps) {
  const [formData, setFormData] = useState<CreateSystemAdminRequest>({
    email: '',
    name: '',
    password: '',
    phone: '',
    department: '',
    position: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof CreateSystemAdminRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = '이메일은 필수입니다';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!formData.name.trim()) {
      newErrors.name = '이름은 필수입니다';
    } else if (formData.name.trim().length < 2 || formData.name.trim().length > 50) {
      newErrors.name = '이름은 2-50자 사이여야 합니다';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호는 필수입니다';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 최소 8자 이상이어야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        email: '',
        name: '',
        password: '',
        phone: '',
        department: '',
        position: '',
      });
      setErrors({});
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        email: '',
        name: '',
        password: '',
        phone: '',
        department: '',
        position: '',
      });
      setErrors({});
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>시스템 관리자 추가</DialogTitle>
          <DialogDescription>
            새로운 시스템 관리자(SYSTEM_ADMIN)를 생성합니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">
                이메일 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="admin@example.com"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                이름 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="홍길동"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">
                비밀번호 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange('password')}
                placeholder="최소 8자 이상"
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <Label htmlFor="phone">연락처</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange('phone')}
                placeholder="010-1234-5678"
                disabled={isSubmitting}
              />
            </div>

            {/* Department */}
            <div className="grid gap-2">
              <Label htmlFor="department">부서</Label>
              <Input
                id="department"
                type="text"
                value={formData.department}
                onChange={handleChange('department')}
                placeholder="IT팀"
                disabled={isSubmitting}
              />
            </div>

            {/* Position */}
            <div className="grid gap-2">
              <Label htmlFor="position">직책</Label>
              <Input
                id="position"
                type="text"
                value={formData.position}
                onChange={handleChange('position')}
                placeholder="팀장"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '생성 중...' : '생성'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
