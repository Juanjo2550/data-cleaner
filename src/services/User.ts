import {EMAIL_REGEX_PATTER, fixYear} from "../utils/utils";

export type TUserConstructor = {
  code?: number;
  dni?: number;
  address?: string;
  phone?: number;
  birthDate?: Date;
  age?: number;
  grade?: number;
  name?: string;
  lastname?: string;
  email?: string;
}

export type TFailingUser = User & { missingProps: string[] };

export type TUsers = {
  passing: User[];
  failing: TFailingUser[];
}

export default class User {
  private code?: number;
  private dni?: number;
  private address?: string;
  private phone?: number;
  private birthDate?: Date;
  private age?: number;
  private grade?: number;
  private name?: string;
  private lastname?: string;
  private email?: string;

  constructor({
                code,
                dni,
                address,
                phone,
                birthDate,
                age,
                grade,
                name,
                lastname,
                email
              }: TUserConstructor) {
    this.code = code;
    // User.checkDni(dni ? dni.toString() : undefined) ? this.dni = dni : this.dni = undefined;
    this.dni = dni;
    this.address = address;
    this.phone = phone;
    // User.checkBirthDate(birthDate) ? this.birthDate = birthDate : this.birthDate = undefined;
    this.birthDate = birthDate;
    // User.checkAge(age ? age : undefined, this.birthDate) ? this.age = age : this.age = undefined;
    this.age = age;
    this.grade = grade;
    this.name = name;
    this.lastname = lastname;
    // User.checkEmail(email) ? this.email = email : this.email = undefined;
    this.email = email;
  }

  getMissingProps(): any[] {
    const dniError = {
      propName: 'dni',
      error: '',
    };

    const birthDateError = {
      propName: 'dni',
      error: '',
    }

    const ageError = {
      propName: 'age',
      error: '',
    }

    const emailError = {
      propName: 'email',
      error: '',
    }

    if (!this.dni) {
      dniError.error = 'missing prop'
    } else {
      if (User.checkDni(this.dni.toString()) === false) {
        dniError.error = 'format error'
      }
    }

    if (!this.birthDate) {
      birthDateError.error = 'missing prop';
    } else {
      if (User.checkBirthDate(this.birthDate) === false) {
        birthDateError.error = 'The date entered is not valid';
      } else {
        if (!this.age) {
          ageError.error = 'missing prop';
        } else {
          if (User.checkAge(this.age, this.birthDate) === false) {
            ageError.error = 'Age does not match date of birth';
          }
        }
      }
    }

    if(!this.email) {
      emailError.error = 'missing prop'
    } else {
      if (User.checkEmail(this.email) === false) {
        emailError.error = 'format error';
      }
    }

    const missingProps: any [] = []
    !this.code && missingProps.push({
      propName: 'code',
      error: 'missing prop'
    });
    dniError.error !== '' && missingProps.push(dniError);
    !this.address && missingProps.push({
      propName: 'address',
      error: 'missing prop'
    });
    !this.phone && missingProps.push({
      propName: 'phone',
      error: 'missing prop'
    });
    birthDateError.error !== ''&& missingProps.push(birthDateError);
    ageError.error !== '' && missingProps.push(ageError);
    !this.grade && missingProps.push({
      name: 'grade',
      error: 'missing prop'
    });
    !this.name && missingProps.push({
      name: 'name',
      error: 'missing prop'
    });
    !this.lastname && missingProps.push({
      name: 'lastname',
      error: 'missing prop'
    });
    emailError.error !== '' && missingProps.push(emailError);
    return missingProps;
  }

  static checkAge(age?: number, birthDate?: Date): boolean {
    if (birthDate) {
      return age === (new Date().getFullYear() - birthDate.getFullYear())
    }
    return false;
  }

  static checkBirthDate(date?: Date): boolean {
    if (date) {
      return date < new Date()
    } else {
      return false;
    }
  }

  static checkDni(dni?: string): boolean {
    if (dni) {
      let isValid = false;
      let total = 0;
      const length = dni.length;
      const longCheck = length - 1;
      if (dni !== "") {
        if (length === 10) {
          for (let i = 0; i < longCheck; i++) {
            if (i % 2 === 0) {
              let aux = Number(dni.charAt(i)) * 2;
              if (aux > 9) aux -= 9;
              total += aux;
            } else {
              total += parseInt(dni.charAt(i));
            }
          }
          total = total % 10 ? 10 - total % 10 : 0;
          isValid = total.toString() === dni.charAt(length - 1);
        }
      }
      return isValid
    } else {
      return false;
    }
  }

  static checkEmail(email?: string): boolean {
    if (email) {
      return EMAIL_REGEX_PATTER.test(email);
    } else {
      return false;
    }
  }

  static parseUsers(file: any): User[] {
    return file.getRows().map((user: any) => {
      //day-month-year
      const dateArray =user.fecha_nacimiento_est ? user.fecha_nacimiento_est.split('/') : ['']
      return new User({
          code: Number(user.codigo_est),
          dni: Number(user.cedula_est),
          address: user.direccion_est,
          phone: Number(user.telefono_est),
          birthDate: user.fecha_nacimiento_est ? new Date(fixYear(dateArray[2]), dateArray[1], dateArray[0]): undefined,
          age: Number(user.edad_est),
          grade: Number(user.calificacion),
          name: user.nombre_est,
          lastname: user.apellido_est,
          email: user.correo_est,
        }
      );
    });
  }

  static classifyUsers(file: any): TUsers {
    const users = User.parseUsers(file);
    const success: User[] = [];
    const failing: TFailingUser[] = [];
    users.map((user: User) => {
      if (user.getMissingProps().length === 0) {
        success.push(user);
      } else {
        failing.push({
          ...user,
          missingProps: user.getMissingProps(),
          getMissingProps: () => ['']
        });
      }
    });
    return {
      passing: success,
      failing,
    }
  }
}