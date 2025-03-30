import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export class FormUtil {
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static passwordPattern =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!%*?&])([A-Za-zd$@$!%*?&]|[^ ]){8,15}$';
  static slugPattern = '^[a-z0-9_]+(?:-[a-z0-9_]+)*$';

  static isValidField(fieldName: string, form: FormGroup): boolean | null {
    return (
      !!form.controls[fieldName].errors && form.controls[fieldName].touched
    );
  }

  static getFieldError(fieldName: string, form: FormGroup): string | null {
    if (!form.controls[fieldName]) return null;

    const errores = form.controls[fieldName].errors ?? {};

    return this.getTextError(errores);
  }

  static getFormError(form: FormGroup): string | null {
    if (!form) return null;

    const errores = form.errors ?? {};

    return this.getTextError(errores);
  }

  static getTextError(errores: ValidationErrors): string | null {
    for (const key of Object.keys(errores)) {
      switch (key) {
        case 'required':
          return 'Este campo es obligatorio';
        case 'minlength':
          return `este campo requiere una cantidad minima de ${errores['minlength'].requiredLength} caracteres`;
        case 'min':
          return `este campo requiere una cantidad minima de ${errores['min'].min} `;
        case 'email':
          return `No es un email valido`;
        case 'pattern':
          if (errores['pattern'].requiredPattern === FormUtil.emailPattern) {
            return ' El valor ingresado no parece un correo electronico';
          }

          if (errores['pattern'].requiredPattern === FormUtil.namePattern) {
            return 'Por favor incluir un nombre y un apellido';
          }

          if (errores['pattern'].requiredPattern === FormUtil.passwordPattern) {
            return 'La contraseña debe tener al entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula.';
          }

          return 'Error de patron con la expresion';
        case 'emailTaken':
          return 'El correo electronico ya se encuentra registrado';
        case 'passwordsNotEqual':
          return 'Las contraseñas tiene que ser iguales, Validar los campos.';

        default:
          return 'Error de validacion no controlado';
      }
    }
    return null;
  }

  static isFieldOneEqualFieldTwo(field: string, field2: string) {
    return (formGroup: AbstractControl) => {
      const field1Value = formGroup.get(field)?.value;
      const field2Value = formGroup.get(field2)?.value;

      return field1Value === field2Value
        ? null
        : {
            passwordsNotEqual: true,
          };
    };
  }
}
