import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IAuthority, NewAuthority } from '../authority.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { name: unknown }> = Partial<Omit<T, 'name'>> & { name: T['name'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAuthority for edit and NewAuthorityFormGroupInput for create.
 */
type AuthorityFormGroupInput = IAuthority | PartialWithRequiredKeyOf<NewAuthority>;

type AuthorityFormDefaults = Pick<NewAuthority, 'name'>;

type AuthorityFormGroupContent = {
  name: FormControl<IAuthority['name'] | NewAuthority['name']>;
};

export type AuthorityFormGroup = FormGroup<AuthorityFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AuthorityFormService {
  createAuthorityFormGroup(authority?: AuthorityFormGroupInput): AuthorityFormGroup {
    const authorityRawValue = {
      ...this.getFormDefaults(),
      ...(authority ?? { name: null }),
    };

    return new FormGroup<AuthorityFormGroupContent>({
      name: new FormControl(
        { value: authorityRawValue.name, disabled: authorityRawValue.name !== null },
        {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(50)],
        },
      ),
    });
  }

  getAuthority(form: AuthorityFormGroup): NewAuthority {
    return form.getRawValue() as NewAuthority;
  }

  resetForm(form: AuthorityFormGroup, authority: AuthorityFormGroupInput): void {
    const authorityRawValue = { ...this.getFormDefaults(), ...authority };
    form.reset({
      ...authorityRawValue,
      name: { value: authorityRawValue.name, disabled: authorityRawValue.name !== null },
    });
  }

  private getFormDefaults(): AuthorityFormDefaults {
    return {
      name: null,
    };
  }
}
