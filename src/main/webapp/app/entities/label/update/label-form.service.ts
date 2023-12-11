import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILabel, NewLabel } from '../label.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILabel for edit and NewLabelFormGroupInput for create.
 */
type LabelFormGroupInput = ILabel | PartialWithRequiredKeyOf<NewLabel>;

type LabelFormDefaults = Pick<NewLabel, 'id'>;

type LabelFormGroupContent = {
  id: FormControl<ILabel['id'] | NewLabel['id']>;
  label: FormControl<ILabel['label']>;
};

export type LabelFormGroup = FormGroup<LabelFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LabelFormService {
  createLabelFormGroup(label: LabelFormGroupInput = { id: null }): LabelFormGroup {
    const labelRawValue = {
      ...this.getFormDefaults(),
      ...label,
    };
    return new FormGroup<LabelFormGroupContent>({
      id: new FormControl(
        { value: labelRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      label: new FormControl(labelRawValue.label, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
    });
  }

  getLabel(form: LabelFormGroup): ILabel | NewLabel {
    return form.getRawValue() as ILabel | NewLabel;
  }

  resetForm(form: LabelFormGroup, label: LabelFormGroupInput): void {
    const labelRawValue = { ...this.getFormDefaults(), ...label };
    form.reset(
      {
        ...labelRawValue,
        id: { value: labelRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): LabelFormDefaults {
    return {
      id: null,
    };
  }
}
