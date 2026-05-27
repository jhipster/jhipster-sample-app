import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

type LabelFormDefaults = Pick<NewLabel, 'id' | 'operations'>;

type LabelFormGroupContent = {
  id: FormControl<ILabel['id'] | NewLabel['id']>;
  label: FormControl<ILabel['label']>;
  operations: FormControl<ILabel['operations']>;
};

export type LabelFormGroup = FormGroup<LabelFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LabelFormService {
  createLabelFormGroup(label?: LabelFormGroupInput): LabelFormGroup {
    const labelRawValue = {
      ...this.getFormDefaults(),
      ...(label ?? { id: null }),
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
      operations: new FormControl(labelRawValue.operations ?? []),
    });
  }

  getLabel(form: LabelFormGroup): ILabel | NewLabel {
    return form.getRawValue();
  }

  resetForm(form: LabelFormGroup, label: LabelFormGroupInput): void {
    const labelRawValue = { ...this.getFormDefaults(), ...label };
    form.reset({
      ...labelRawValue,
      id: { value: labelRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): LabelFormDefaults {
    return {
      id: null,
      operations: [],
    };
  }
}
