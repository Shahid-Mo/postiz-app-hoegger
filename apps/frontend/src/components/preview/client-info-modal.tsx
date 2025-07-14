'use client';

import { FC, useCallback, useState } from 'react';
import { Button } from '@gitroom/react/form/button';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useT } from '@gitroom/react/translation/get.transation.service.client';

interface ClientInfoModalProps {
  isOpen: boolean;
  onSubmit: (info: { name: string; email: string }) => void;
  onClose: () => void;
}

export const ClientInfoModal: FC<ClientInfoModalProps> = ({ isOpen, onSubmit, onClose }) => {
  const { handleSubmit, register, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useT();

  const submit: SubmitHandler<FieldValues> = useCallback(
    async (data) => {
      setIsSubmitting(true);
      try {
        onSubmit({
          name: data.name,
          email: data.email,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-third border border-tableBorder rounded-lg p-6 w-full max-w-md mx-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">
            {t('introduce_yourself', 'Introduce Yourself')}
          </h3>
          <p className="text-sm text-gray-400">
            {t('client_info_description', 'Please provide your name and email to help us identify your comments. This information will be saved for future visits.')}
          </p>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
              {t('name', 'Name')} <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name', { 
                required: t('name_required', 'Name is required'),
                minLength: { 
                  value: 2, 
                  message: t('name_min_length', 'Name must be at least 2 characters') 
                }
              })}
              type="text"
              id="name"
              className="w-full px-3 py-2 text-sm text-white bg-input border border-tableBorder rounded-md focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
              placeholder={t('enter_your_name', 'Enter your name')}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
              {t('email', 'Email')} <span className="text-red-500">*</span>
            </label>
            <input
              {...register('email', { 
                required: t('email_required', 'Email is required'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('email_invalid', 'Invalid email address')
                }
              })}
              type="email"
              id="email"
              className="w-full px-3 py-2 text-sm text-white bg-input border border-tableBorder rounded-md focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
              placeholder={t('enter_your_email', 'Enter your email')}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>
            )}
          </div>

          <div className="text-xs text-gray-500">
            {t('privacy_notice', 'Your information will be stored locally and used only for comment identification.')}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              secondary={true}
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t('cancel', 'Cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? t('saving', 'Saving...') : t('save_continue', 'Save & Continue')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};