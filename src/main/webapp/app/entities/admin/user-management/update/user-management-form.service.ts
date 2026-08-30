import { Service } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config';
import { IUserManagement, NewUserManagement } from '../user-management.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { login: unknown }> = Partial<Omit<T, 'login'>> & { login: T['login'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserManagement for edit and NewUserManagementFormGroupInput for create.
 */
type UserManagementFormGroupInput = IUserManagement | PartialWithRequiredKeyOf<NewUserManagement>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IUserManagement | NewUserManagement> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type UserManagementFormRawValue = FormValueOf<IUserManagement>;

type NewUserManagementFormRawValue = FormValueOf<NewUserManagement>;

type UserManagementFormDefaults = Pick<
  NewUserManagement,
  'login' | 'activated' | 'langKey' | 'createdDate' | 'lastModifiedDate' | 'authorities'
>;

type UserManagementFormGroupContent = {
  id: FormControl<UserManagementFormRawValue['id']>;
  login: FormControl<UserManagementFormRawValue['login'] | NewUserManagement['login']>;
  firstName: FormControl<UserManagementFormRawValue['firstName']>;
  lastName: FormControl<UserManagementFormRawValue['lastName']>;
  email: FormControl<UserManagementFormRawValue['email']>;
  activated: FormControl<UserManagementFormRawValue['activated']>;
  langKey: FormControl<UserManagementFormRawValue['langKey']>;
  imageUrl: FormControl<UserManagementFormRawValue['imageUrl']>;
  createdBy: FormControl<UserManagementFormRawValue['createdBy']>;
  createdDate: FormControl<UserManagementFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<UserManagementFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<UserManagementFormRawValue['lastModifiedDate']>;
  authorities: FormControl<UserManagementFormRawValue['authorities']>;
};

export type UserManagementFormGroup = FormGroup<UserManagementFormGroupContent>;

@Service()
export class UserManagementFormService {
  createUserManagementFormGroup(userManagement?: UserManagementFormGroupInput): UserManagementFormGroup {
    const userManagementRawValue = this.convertUserManagementToUserManagementRawValue({
      ...this.getFormDefaults(),
      ...(userManagement ?? { login: null }),
    });

    return new FormGroup<UserManagementFormGroupContent>({
      id: new FormControl(userManagementRawValue.id),
      login: new FormControl(userManagementRawValue.login, {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'), // NOSONAR
        ],
      }),
      firstName: new FormControl(userManagementRawValue.firstName, {
        validators: [Validators.maxLength(50)],
      }),
      lastName: new FormControl(userManagementRawValue.lastName, {
        validators: [Validators.maxLength(50)],
      }),
      email: new FormControl(userManagementRawValue.email, {
        validators: [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(191)],
      }),
      activated: new FormControl(userManagementRawValue.activated),
      langKey: new FormControl(userManagementRawValue.langKey, {
        validators: [Validators.maxLength(10)],
      }),
      imageUrl: new FormControl(userManagementRawValue.imageUrl, {
        validators: [Validators.maxLength(256)],
      }),
      createdBy: new FormControl(userManagementRawValue.createdBy),
      createdDate: new FormControl(userManagementRawValue.createdDate),
      lastModifiedBy: new FormControl(userManagementRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(userManagementRawValue.lastModifiedDate),
      authorities: new FormControl(userManagementRawValue.authorities ?? []),
    });
  }

  getUserManagement(form: UserManagementFormGroup): IUserManagement | NewUserManagement {
    return this.convertUserManagementRawValueToUserManagement(form.getRawValue());
  }

  resetForm(form: UserManagementFormGroup, userManagement: UserManagementFormGroupInput): void {
    const userManagementRawValue = this.convertUserManagementToUserManagementRawValue({ ...this.getFormDefaults(), ...userManagement });
    form.reset({
      ...userManagementRawValue,
    });
  }

  private getFormDefaults(): UserManagementFormDefaults {
    const currentTime = dayjs();

    return {
      login: null,
      activated: true,
      langKey: 'en',
      createdDate: currentTime,
      lastModifiedDate: currentTime,
      authorities: [],
    };
  }

  private convertUserManagementRawValueToUserManagement(
    rawUserManagement: UserManagementFormRawValue | NewUserManagementFormRawValue,
  ): IUserManagement | NewUserManagement {
    return {
      ...rawUserManagement,
      createdDate: dayjs(rawUserManagement.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawUserManagement.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertUserManagementToUserManagementRawValue(
    userManagement: IUserManagement | (Partial<NewUserManagement> & UserManagementFormDefaults),
  ): UserManagementFormRawValue | PartialWithRequiredKeyOf<NewUserManagementFormRawValue> {
    return {
      ...userManagement,
      createdDate: userManagement.createdDate ? userManagement.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: userManagement.lastModifiedDate ? userManagement.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
      authorities: userManagement.authorities ?? [],
    };
  }
}
