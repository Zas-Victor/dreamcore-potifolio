import React, { useState, useEffect } from 'react';
import { 
  sanitizeInput, 
  validateSafeString, 
  formValidation, 
  rateLimiter,
  securityMonitor 
} from '@/utils/security';
import { useSecurity } from './SecurityProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// ==========================================
// COMPONENTE DE FORMULÁRIO SEGURO
// ==========================================

interface SecureFormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  sanitize?: boolean;
  validate?: (value: string) => boolean | string;
}

interface SecureFormProps {
  fields: SecureFormField[];
  onSubmit: (data: Record<string, string>, csrfToken: string) => Promise<void>;
  submitLabel?: string;
  maxAttempts?: number;
  rateLimitWindowMs?: number;
  className?: string;
}

export const SecureForm: React.FC<SecureFormProps> = ({
  fields,
  onSubmit,
  submitLabel = 'Enviar',
  maxAttempts = 5,
  rateLimitWindowMs = 60000,
  className = ''
}) => {
  const { csrfToken, reportViolation } = useSecurity();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  // Inicializa dados do formulário
  useEffect(() => {
    const initialData: Record<string, string> = {};
    fields.forEach(field => {
      initialData[field.name] = '';
    });
    setFormData(initialData);
  }, [fields]);

  // Verifica rate limiting
  const canSubmit = (): boolean => {
    const identifier = `form_submit_${window.location.pathname}`;
    return rateLimiter.canPerform(identifier, maxAttempts, rateLimitWindowMs);
  };

  // Valida um campo específico
  const validateField = (field: SecureFormField, value: string): string | null => {
    // Verifica se é obrigatório
    if (field.required && !formValidation.required(value)) {
      return `${field.label} é obrigatório`;
    }

    // Se vazio e não obrigatório, passa
    if (!value && !field.required) {
      return null;
    }

    // Verifica comprimento mínimo
    if (field.minLength && !formValidation.minLength(value, field.minLength)) {
      return `${field.label} deve ter pelo menos ${field.minLength} caracteres`;
    }

    // Verifica comprimento máximo
    if (field.maxLength && !formValidation.maxLength(value, field.maxLength)) {
      return `${field.label} deve ter no máximo ${field.maxLength} caracteres`;
    }

    // Verifica padrão regex
    if (field.pattern && !formValidation.pattern(value, field.pattern)) {
      return `${field.label} possui formato inválido`;
    }

    // Validação de email
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Email inválido';
      }
    }

    // Verifica se contém caracteres seguros
    if (!validateSafeString(value)) {
      reportViolation(
        'UNSAFE_INPUT_DETECTED',
        `Caracteres potencialmente maliciosos detectados no campo ${field.name}`,
        { field: field.name, value: value.substring(0, 50) }
      );
      return `${field.label} contém caracteres não permitidos`;
    }

    // Validação customizada
    if (field.validate) {
      const result = field.validate(value);
      if (typeof result === 'string') {
        return result;
      }
      if (result === false) {
        return `${field.label} é inválido`;
      }
    }

    return null;
  };

  // Manipula mudança de campo
  const handleFieldChange = (fieldName: string, value: string) => {
    const field = fields.find(f => f.name === fieldName);
    if (!field) return;

    // Sanitiza se necessário
    const processedValue = field.sanitize ? sanitizeInput(value) : value;

    // Atualiza dados
    setFormData(prev => ({
      ...prev,
      [fieldName]: processedValue
    }));

    // Remove erro se existe
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Valida todo o formulário
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field, formData[field.name] || '');
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Manipula envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica rate limiting
    if (!canSubmit()) {
      setIsBlocked(true);
      toast({
        title: 'Muitas tentativas',
        description: 'Aguarde antes de tentar novamente.',
        variant: 'destructive'
      });
      
      reportViolation(
        'RATE_LIMIT_EXCEEDED',
        'Limite de tentativas de envio excedido',
        { attempts: submitAttempts, window: rateLimitWindowMs }
      );
      
      return;
    }

    // Valida formulário
    if (!validateForm()) {
      toast({
        title: 'Formulário inválido',
        description: 'Corrija os erros antes de continuar.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitAttempts(prev => prev + 1);

    try {
      // Preparar dados sanitizados
      const sanitizedData: Record<string, string> = {};
      fields.forEach(field => {
        const value = formData[field.name] || '';
        sanitizedData[field.name] = field.sanitize ? sanitizeInput(value) : value;
      });

      // Enviar com token CSRF
      await onSubmit(sanitizedData, csrfToken);

      // Sucesso
      toast({
        title: 'Sucesso',
        description: 'Formulário enviado com sucesso!',
        variant: 'default'
      });

      // Limpar formulário
      const clearedData: Record<string, string> = {};
      fields.forEach(field => {
        clearedData[field.name] = '';
      });
      setFormData(clearedData);
      setErrors({});
      setSubmitAttempts(0);

    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      
      toast({
        title: 'Erro',
        description: 'Erro ao enviar formulário. Tente novamente.',
        variant: 'destructive'
      });

      reportViolation(
        'FORM_SUBMISSION_ERROR',
        'Erro durante envio de formulário',
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderiza campo
  const renderField = (field: SecureFormField) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];
    const fieldId = `secure-field-${field.name}`;

    return (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={fieldId}>
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        {field.type === 'textarea' ? (
          <Textarea
            id={fieldId}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={error ? 'border-red-500 focus:border-red-500' : ''}
            maxLength={field.maxLength}
            disabled={isSubmitting}
          />
        ) : (
          <Input
            id={fieldId}
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={error ? 'border-red-500 focus:border-red-500' : ''}
            maxLength={field.maxLength}
            disabled={isSubmitting}
          />
        )}
        
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        
        {field.maxLength && (
          <p className="text-gray-500 text-xs">
            {value.length}/{field.maxLength} caracteres
          </p>
        )}
      </div>
    );
  };

  if (isBlocked) {
    return (
      <div className={`p-6 border border-red-500 bg-red-50 rounded-lg ${className}`}>
        <h3 className="text-red-700 font-medium mb-2">🔒 Formulário Bloqueado</h3>
        <p className="text-red-600 text-sm mb-4">
          Muitas tentativas detectadas. Aguarde {Math.ceil(rateLimitWindowMs / 60000)} minutos antes de tentar novamente.
        </p>
        <Button 
          onClick={() => setIsBlocked(false)} 
          variant="outline" 
          size="sm"
        >
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {/* Token CSRF oculto */}
      <input type="hidden" name="csrf_token" value={csrfToken} />
      
      {/* Campos do formulário */}
      {fields.map(renderField)}
      
      {/* Informações de segurança */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>🔒 Este formulário é protegido contra ataques maliciosos</p>
        <p>📊 Tentativas: {submitAttempts}/{maxAttempts}</p>
      </div>
      
      {/* Botão de envio */}
      <Button 
        type="submit" 
        disabled={isSubmitting || Object.keys(errors).length > 0}
        className="w-full"
      >
        {isSubmitting ? 'Enviando...' : submitLabel}
      </Button>
    </form>
  );
};

// ==========================================
// CAMPO DE INPUT SEGURO INDIVIDUAL
// ==========================================

interface SecureInputProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  className?: string;
  maxLength?: number;
  sanitize?: boolean;
  validate?: (value: string) => boolean;
  onViolation?: (message: string) => void;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  value,
  onChange,
  type = 'text',
  placeholder,
  className = '',
  maxLength = 1000,
  sanitize = true,
  validate,
  onViolation
}) => {
  const { reportViolation } = useSecurity();
  const [isValid, setIsValid] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Verifica comprimento máximo
    if (newValue.length > maxLength) {
      reportViolation('INPUT_LENGTH_EXCEEDED', `Input excedeu limite de ${maxLength} caracteres`);
      return;
    }

    // Verifica caracteres seguros
    if (!validateSafeString(newValue)) {
      reportViolation('UNSAFE_INPUT', 'Caracteres perigosos detectados no input');
      if (onViolation) {
        onViolation('Caracteres não permitidos detectados');
      }
      return;
    }

    // Sanitiza se necessário
    if (sanitize) {
      newValue = sanitizeInput(newValue);
    }

    // Validação customizada
    if (validate) {
      const valid = validate(newValue);
      setIsValid(valid);
      if (!valid && onViolation) {
        onViolation('Valor inválido');
      }
    }

    onChange(newValue);
  };

  return (
    <Input
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={`${className} ${!isValid ? 'border-red-500' : ''}`}
      maxLength={maxLength}
    />
  );
};