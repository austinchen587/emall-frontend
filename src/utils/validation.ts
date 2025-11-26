// utils/validation.ts
export interface ValidationRules {
  [key: string]: (value: string) => string | null;
}

export const validationRules: ValidationRules = {
  username: (value: string) => {
    if (!value) return '用户名不能为空';
    if (value.length < 3) return '用户名至少3个字符';
    return null;
  },
  
  password: (value: string) => {
    if (!value) return '密码不能为空';
    if (value.length < 6) return '密码至少6个字符';
    return null;
  }
};

// 修复 validateForm 函数，添加更宽松的类型定义
export const validateForm = (data: Record<string, any>, rules: ValidationRules) => {
  const errors: Record<string, string> = {};
  
  Object.keys(rules).forEach(key => {
    if (rules[key]) {
      const error = rules[key](data[key] || '');
      if (error) {
        errors[key] = error;
      }
    }
  });
  
  return errors;
};

// 或者更严格的版本，确保处理 undefined 值
export const validateFormStrict = <T extends Record<string, any>>(
  data: T, 
  rules: ValidationRules
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.keys(rules).forEach(key => {
    const value = data[key] as string;
    const validator = rules[key];
    
    if (validator) {
      const error = validator(value || '');
      if (error) {
        errors[key] = error;
      }
    }
  });
  
  return errors;
};



