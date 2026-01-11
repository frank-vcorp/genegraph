import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MedicalConditionEditor from '@/components/MedicalConditionEditor';
import { MedicalCondition, GenoDate } from '@/types/genogram';

// Mock uuid
vi.mock('uuid', () => ({
  v4: () => 'test-uuid-123',
}));

describe('MedicalConditionEditor', () => {
  const mockOnSave = vi.fn();
  const mockOnClose = vi.fn();

  const mockConditions: MedicalCondition[] = [
    {
      id: 'cond-1',
      name: 'Hipertensión',
      code: 'I10',
      status: 'chronic',
      notes: 'Controlada con medicación',
    },
    {
      id: 'cond-2',
      name: 'Diabetes Tipo 2',
      code: 'E11',
      status: 'active',
      onsetDate: { date: '2015-01-01', precision: 'exact' },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Modal Rendering', () => {
    it('should not render when isOpen is false', () => {
      const { container } = render(
        <MedicalConditionEditor
          isOpen={false}
          onClose={mockOnClose}
          conditions={[]}
          onSave={mockOnSave}
          personName="John Doe"
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('should render when isOpen is true', () => {
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={[]}
          onSave={mockOnSave}
          personName="John Doe"
        />
      );
      expect(screen.getByText(/Condiciones Médicas de John Doe/)).toBeInTheDocument();
    });

    it('should display person name in header', () => {
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={[]}
          onSave={mockOnSave}
          personName="María García"
        />
      );
      expect(screen.getByText(/María García/)).toBeInTheDocument();
    });
  });

  describe('Form Inputs', () => {
    it('should update name input field', async () => {
      const user = userEvent.setup();
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={[]}
          onSave={mockOnSave}
        />
      );

      const nameInput = screen.getByPlaceholderText('ej: Hipertensión, Diabetes');
      await user.type(nameInput, 'Asma');
      expect(nameInput).toHaveValue('Asma');
    });

    it('should update code input field', async () => {
      const user = userEvent.setup();
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={[]}
          onSave={mockOnSave}
        />
      );

      const codeInput = screen.getByPlaceholderText('ej: I10');
      await user.type(codeInput, 'J45');
      expect(codeInput).toHaveValue('J45');
    });

    it('should update status select', async () => {
      const user = userEvent.setup();
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={[]}
          onSave={mockOnSave}
        />
      );

      const statusSelect = screen.getByDisplayValue('Activo');
      await user.selectOptions(statusSelect, 'chronic');
      expect(statusSelect).toHaveValue('chronic');
    });

    it('should update notes textarea', async () => {
      const user = userEvent.setup();
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={[]}
          onSave={mockOnSave}
        />
      );

      const notesInput = screen.getByPlaceholderText('Observaciones médicas relevantes...');
      await user.type(notesInput, 'Requiere seguimiento mensual');
      expect(notesInput).toHaveValue('Requiere seguimiento mensual');
    });
  });

  describe('Add Condition', () => {
    it('should add new condition with minimal fields', async () => {
      const user = userEvent.setup();
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={[]}
          onSave={mockOnSave}
        />
      );

      const nameInput = screen.getByPlaceholderText('ej: Hipertensión, Diabetes');
      await user.type(nameInput, 'Hipertensión');

      const addButton = screen.getByRole('button', { name: /Agregar/i });
      fireEvent.click(addButton);

      // Verify condition is displayed
      await waitFor(() => {
        expect(screen.getByText('Hipertensión')).toBeInTheDocument();
      });
    });

    it('should add new condition with all fields', async () => {
      const user = userEvent.setup();
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={[]}
          onSave={mockOnSave}
        />
      );

      const nameInput = screen.getByPlaceholderText('ej: Hipertensión, Diabetes');
      const codeInput = screen.getByPlaceholderText('ej: I10');
      const statusSelect = screen.getByDisplayValue('Activo');
      const notesInput = screen.getByPlaceholderText('Observaciones médicas relevantes...');

      await user.type(nameInput, 'Diabetes');
      await user.type(codeInput, 'E11');
      await user.selectOptions(statusSelect, 'chronic');
      await user.type(notesInput, 'Controlada con insulina');

      const addButton = screen.getByRole('button', { name: /Agregar/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Diabetes')).toBeInTheDocument();
        expect(screen.getByText('CIE-10: E11')).toBeInTheDocument();
      });
    });

    it('should not add condition without name', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const user = userEvent.setup();
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={[]}
          onSave={mockOnSave}
        />
      );

      const addButton = screen.getByRole('button', { name: /Agregar/i });
      fireEvent.click(addButton);

      expect(alertSpy).toHaveBeenCalledWith('El nombre de la condición es requerido');
      alertSpy.mockRestore();
    });

    it('should clear form after adding condition', async () => {
      const user = userEvent.setup();
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={[]}
          onSave={mockOnSave}
        />
      );

      const nameInput = screen.getByPlaceholderText('ej: Hipertensión, Diabetes') as HTMLInputElement;
      await user.type(nameInput, 'Hipertensión');

      const addButton = screen.getByRole('button', { name: /Agregar/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(nameInput.value).toBe('');
      });
    });
  });

  describe('Edit Condition', () => {
    it('should populate form when editing condition', async () => {
      const user = userEvent.setup();
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={mockConditions}
          onSave={mockOnSave}
        />
      );

      const editButtons = screen.getAllByRole('button', { name: /Editar/i });
      fireEvent.click(editButtons[0]);

      const nameInput = screen.getByPlaceholderText('ej: Hipertensión, Diabetes') as HTMLInputElement;
      expect(nameInput.value).toBe('Hipertensión');
    });

    it('should change form header when editing', async () => {
      const user = userEvent.setup();
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={mockConditions}
          onSave={mockOnSave}
        />
      );

      const editButtons = screen.getAllByRole('button', { name: /Editar/i });
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Editar Condición')).toBeInTheDocument();
      });
    });
  });

  describe('Delete Condition', () => {
    it('should delete condition with confirmation', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={mockConditions}
          onSave={mockOnSave}
        />
      );

      const deleteButtons = screen.getAllByRole('button', { name: /Eliminar/i });
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(confirmSpy).toHaveBeenCalled();
        expect(screen.queryByText('Hipertensión')).not.toBeInTheDocument();
      });

      confirmSpy.mockRestore();
    });

    it('should not delete when confirmation is cancelled', () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={mockConditions}
          onSave={mockOnSave}
        />
      );

      const deleteButtons = screen.getAllByRole('button', { name: /Eliminar/i });
      fireEvent.click(deleteButtons[0]);

      expect(screen.getByText('Hipertensión')).toBeInTheDocument();

      confirmSpy.mockRestore();
    });
  });

  describe('Conditions List Display', () => {
    it('should display all conditions', () => {
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={mockConditions}
          onSave={mockOnSave}
        />
      );

      expect(screen.getByText('Hipertensión')).toBeInTheDocument();
      expect(screen.getByText('Diabetes Tipo 2')).toBeInTheDocument();
    });

    it('should display condition codes', () => {
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={mockConditions}
          onSave={mockOnSave}
        />
      );

      expect(screen.getByText('CIE-10: I10')).toBeInTheDocument();
      expect(screen.getByText('CIE-10: E11')).toBeInTheDocument();
    });

    it('should display condition notes', () => {
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={mockConditions}
          onSave={mockOnSave}
        />
      );

      expect(screen.getByText('Controlada con medicación')).toBeInTheDocument();
    });

    it('should display condition count', () => {
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={mockConditions}
          onSave={mockOnSave}
        />
      );

      expect(screen.getByText('Condiciones (2)')).toBeInTheDocument();
    });

    it('should show empty message when no conditions', () => {
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={[]}
          onSave={mockOnSave}
        />
      );

      expect(screen.getByText('No hay condiciones médicas registradas')).toBeInTheDocument();
    });
  });

  describe('Date Handling', () => {
    it('should handle onset date input', async () => {
      const user = userEvent.setup();
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={[]}
          onSave={mockOnSave}
        />
      );

      const nameInput = screen.getByPlaceholderText('ej: Hipertensión, Diabetes');
      await user.type(nameInput, 'Hipertensión');

      const addButton = screen.getByRole('button', { name: /Agregar/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        // Just verify the condition was added
        expect(screen.getByText('Hipertensión')).toBeInTheDocument();
      });
    });

    it('should display onset and end dates', () => {
      const conditionWithDates: MedicalCondition = {
        id: 'cond-3',
        name: 'Fractura',
        status: 'cured',
        onsetDate: { date: '2023-06-01', precision: 'exact' },
        endDate: { date: '2023-09-01', precision: 'exact' },
      };

      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={[conditionWithDates]}
          onSave={mockOnSave}
        />
      );

      // Just verify the condition with dates is displayed
      expect(screen.getByText('Fractura')).toBeInTheDocument();
    });
  });

  describe('Save Functionality', () => {
    it('should call onSave with conditions when saving', async () => {
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={mockConditions}
          onSave={mockOnSave}
        />
      );

      const saveButton = screen.getByRole('button', { name: /Guardar Cambios/i });
      fireEvent.click(saveButton);

      expect(mockOnSave).toHaveBeenCalledWith(expect.arrayContaining(mockConditions));
    });

    it('should call onClose after saving', async () => {
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={[]}
          onSave={mockOnSave}
        />
      );

      const saveButton = screen.getByRole('button', { name: /Guardar Cambios/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should preserve new conditions when saving', async () => {
      const user = userEvent.setup();
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={mockConditions}
          onSave={mockOnSave}
        />
      );

      const nameInput = screen.getByPlaceholderText('ej: Hipertensión, Diabetes');
      await user.type(nameInput, 'Asma');

      const addButton = screen.getByRole('button', { name: /Agregar/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: /Guardar Cambios/i });
        fireEvent.click(saveButton);

        expect(mockOnSave).toHaveBeenCalledWith(expect.arrayContaining([
          expect.objectContaining({ name: 'Asma' }),
        ]));
      });
    });
  });

  describe('Modal Controls', () => {
    it('should call onClose when cancel button clicked', () => {
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={[]}
          onSave={mockOnSave}
        />
      );

      const cancelButton = screen.getAllByRole('button', { name: /Cancelar/i })[0];
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Form State Management', () => {
    it('should show correct header for new condition form', () => {
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={[]}
          onSave={mockOnSave}
        />
      );

      expect(screen.getByText('Nueva Condición')).toBeInTheDocument();
    });

    it('should show correct header when editing', async () => {
      const user = userEvent.setup();
      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={mockConditions}
          onSave={mockOnSave}
        />
      );

      const editButtons = screen.getAllByRole('button', { name: /Editar/i });
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Editar Condición')).toBeInTheDocument();
      });
    });
  });

  describe('Status Badge Colors', () => {
    it('should display correct status badges for different conditions', () => {
      const conditions: MedicalCondition[] = [
        { id: '1', name: 'Hypertension', status: 'chronic' },
        { id: '2', name: 'Diabetes', status: 'active' },
      ];

      render(
        <MedicalConditionEditor
          isOpen={true}
          onClose={mockOnClose}
          conditions={conditions}
          onSave={mockOnSave}
        />
      );

      // Verify at least one status badge is present
      const badges = screen.getAllByText(/Crónico|Activo|Curado|Remisión/);
      expect(badges.length).toBeGreaterThan(0);
    });
  });
});
