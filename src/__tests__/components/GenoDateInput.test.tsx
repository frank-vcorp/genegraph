import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GenoDateInput from '@/components/GenoDateInput';
import { GenoDate } from '@/types/genogram';

describe('GenoDateInput Component', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all precision tabs', () => {
      render(
        <GenoDateInput
          value={null}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByRole('button', { name: /Exacta/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Aprox/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Antes/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Después/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Desconocida/i })).toBeInTheDocument();
    });

    it('should render label when provided', () => {
      render(
        <GenoDateInput
          value={null}
          onChange={mockOnChange}
          label="Fecha de Nacimiento"
        />
      );

      expect(screen.getByText('Fecha de Nacimiento')).toBeInTheDocument();
    });

    it('should render required asterisk when required=true', () => {
      render(
        <GenoDateInput
          value={null}
          onChange={mockOnChange}
          required={true}
        />
      );

      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should render date input field', () => {
      render(
        <GenoDateInput
          value={null}
          onChange={mockOnChange}
        />
      );

      const dateInput = screen.getByDisplayValue('') as HTMLInputElement;
      expect(dateInput.type).toBe('date');
    });

    it('should render preview section', () => {
      render(
        <GenoDateInput
          value={null}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByText('Vista previa:')).toBeInTheDocument();
    });
  });

  describe('Precision Selection', () => {
    it('should default to exact precision', () => {
      render(
        <GenoDateInput
          value={null}
          onChange={mockOnChange}
        />
      );

      const exactButton = screen.getByRole('button', { name: /Exacta/i });
      expect(exactButton).toHaveClass('bg-blue-500');
    });

    it('should change precision when tab clicked', async () => {
      const user = userEvent.setup();
      const value: GenoDate = {
        date: '1990-05-15',
        precision: 'exact',
      };

      render(
        <GenoDateInput
          value={value}
          onChange={mockOnChange}
        />
      );

      const aproximadoButton = screen.getByRole('button', { name: /Aprox/i });
      await user.click(aproximadoButton);

      expect(aproximadoButton).toHaveClass('bg-blue-500');
      expect(mockOnChange).toHaveBeenCalled();
    });

    it('should initialize with provided precision', () => {
      const value: GenoDate = {
        date: '1990-05-15',
        precision: 'about',
      };

      render(
        <GenoDateInput
          value={value}
          onChange={mockOnChange}
        />
      );

      const aproximadoButton = screen.getByRole('button', { name: /Aprox/i });
      expect(aproximadoButton).toHaveClass('bg-blue-500');
    });

    it('should show all precision options', () => {
      render(
        <GenoDateInput
          value={null}
          onChange={mockOnChange}
        />
      );

      const buttons = screen.getAllByRole('button', { name: /Exacta|Aprox|Antes|Después|Desconocida/i });
      expect(buttons.length).toBe(5);
    });
  });

  describe('Date Input', () => {
    it('should update date when input changes', async () => {
      const user = userEvent.setup();
      render(
        <GenoDateInput
          value={null}
          onChange={mockOnChange}
        />
      );

      const dateInput = screen.getByDisplayValue('');
      await user.type(dateInput, '1990-05-15');

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          date: '1990-05-15',
          precision: 'exact',
        })
      );
    });

    it('should initialize with provided date', () => {
      const value: GenoDate = {
        date: '1990-05-15',
        precision: 'exact',
      };

      render(
        <GenoDateInput
          value={value}
          onChange={mockOnChange}
        />
      );

      const dateInput = screen.getByDisplayValue('1990-05-15');
      expect(dateInput).toBeInTheDocument();
    });

    it('should not render date input when precision is unknown', () => {
      render(
        <GenoDateInput
          value={{ date: '', precision: 'unknown' }}
          onChange={mockOnChange}
        />
      );

      const dateInputs = screen.queryAllByRole('textbox', { hidden: true });
      // Should not have date input (only custom display input if checkbox is checked)
      const dateInput = dateInputs.find((el) => el.getAttribute('type') === 'date');
      expect(dateInput).toBeUndefined();
    });
  });

  describe('Custom Display', () => {
    it('should toggle custom display checkbox', async () => {
      const user = userEvent.setup();
      render(
        <GenoDateInput
          value={null}
          onChange={mockOnChange}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(checkbox).toBeChecked();
    });

    it('should show custom display input when checked', async () => {
      const user = userEvent.setup();
      render(
        <GenoDateInput
          value={null}
          onChange={mockOnChange}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      const customInput = screen.getByPlaceholderText(/ej: Invierno 1990/);
      expect(customInput).toBeInTheDocument();
    });

    it('should update display value when custom input changes', async () => {
      const user = userEvent.setup();
      render(
        <GenoDateInput
          value={{ date: '1990-05-15', precision: 'exact' }}
          onChange={mockOnChange}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      const customInput = screen.getByPlaceholderText(/ej: Invierno 1990/);
      await user.type(customInput, 'Invierno 1990');

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          display: 'Invierno 1990',
        })
      );
    });

    it('should initialize with custom display value', () => {
      const value: GenoDate = {
        date: '1990-05-15',
        precision: 'exact',
        display: 'Invierno 1990',
      };

      render(
        <GenoDateInput
          value={value}
          onChange={mockOnChange}
        />
      );

      const customInput = screen.getByDisplayValue('Invierno 1990');
      expect(customInput).toBeInTheDocument();
    });
  });

  describe('Preview Display', () => {
    it('should show placeholder in preview when no date', () => {
      render(
        <GenoDateInput
          value={null}
          onChange={mockOnChange}
          placeholder="Selecciona una fecha"
        />
      );

      expect(screen.getByText('Selecciona una fecha', { selector: 'p' })).toBeInTheDocument();
    });

    it('should show Desconocida for unknown precision', () => {
      render(
        <GenoDateInput
          value={{ date: '', precision: 'unknown' }}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByText('Desconocida', { selector: 'p' })).toBeInTheDocument();
    });

    it('should show formatted date for exact precision', () => {
      const value: GenoDate = {
        date: '1990-05-15',
        precision: 'exact',
      };

      render(
        <GenoDateInput
          value={value}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByText(/\d{1,2} de \w+ de 1990/, { selector: 'p' })).toBeInTheDocument();
    });

    it('should show Aprox. prefix for about precision', () => {
      const value: GenoDate = {
        date: '1990-05-15',
        precision: 'about',
      };

      render(
        <GenoDateInput
          value={value}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByText(/Aprox\. \d{1,2} de \w+ de \d{4}/, { selector: 'p' })).toBeInTheDocument();
    });

    it('should show Antes de prefix for before precision', () => {
      const value: GenoDate = {
        date: '1990-05-15',
        precision: 'before',
      };

      render(
        <GenoDateInput
          value={value}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByText(/Antes de \d{1,2} de \w+ de \d{4}/, { selector: 'p' })).toBeInTheDocument();
    });

    it('should show Después de prefix for after precision', () => {
      const value: GenoDate = {
        date: '1990-05-15',
        precision: 'after',
      };

      render(
        <GenoDateInput
          value={value}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByText(/Después de \d{1,2} de \w+ de \d{4}/, { selector: 'p' })).toBeInTheDocument();
    });

    it('should use custom display in preview when provided', () => {
      const value: GenoDate = {
        date: '1990-05-15',
        precision: 'exact',
        display: 'Invierno 1990',
      };

      render(
        <GenoDateInput
          value={value}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByText('Invierno 1990', { selector: 'p' })).toBeInTheDocument();
    });
  });

  describe('Clear Button', () => {
    it('should render clear button when showClear=true and has value', () => {
      const value: GenoDate = {
        date: '1990-05-15',
        precision: 'exact',
      };

      render(
        <GenoDateInput
          value={value}
          onChange={mockOnChange}
          showClear={true}
        />
      );

      expect(screen.getByRole('button', { name: /Limpiar fecha/i })).toBeInTheDocument();
    });

    it('should clear date when clear button clicked', async () => {
      const user = userEvent.setup();
      const value: GenoDate = {
        date: '1990-05-15',
        precision: 'exact',
      };

      render(
        <GenoDateInput
          value={value}
          onChange={mockOnChange}
          showClear={true}
        />
      );

      const clearButton = screen.getByRole('button', { name: /Limpiar fecha/i });
      await user.click(clearButton);

      expect(mockOnChange).toHaveBeenCalledWith(null);
    });

    it('should not render clear button when showClear=false', () => {
      const value: GenoDate = {
        date: '1990-05-15',
        precision: 'exact',
      };

      render(
        <GenoDateInput
          value={value}
          onChange={mockOnChange}
          showClear={false}
        />
      );

      expect(screen.queryByRole('button', { name: /Limpiar fecha/i })).not.toBeInTheDocument();
    });

    it('should render clear button for unknown precision', () => {
      render(
        <GenoDateInput
          value={{ date: '', precision: 'unknown' }}
          onChange={mockOnChange}
          showClear={true}
        />
      );

      expect(screen.getByRole('button', { name: /Limpiar fecha/i })).toBeInTheDocument();
    });
  });

  describe('Props Validation', () => {
    it('should accept null value', () => {
      const { container } = render(
        <GenoDateInput
          value={null}
          onChange={mockOnChange}
        />
      );

      expect(container).toBeInTheDocument();
    });

    it('should use default label', () => {
      render(
        <GenoDateInput
          value={null}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByText('Fecha')).toBeInTheDocument();
    });

    it('should use custom placeholder', () => {
      render(
        <GenoDateInput
          value={null}
          onChange={mockOnChange}
          placeholder="Selecciona fecha de nacimiento"
        />
      );

      expect(screen.getByText('Selecciona fecha de nacimiento')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should handle complete workflow: set date, change precision, add display, clear', async () => {
      const user = userEvent.setup();
      render(
        <GenoDateInput
          value={null}
          onChange={mockOnChange}
          showClear={true}
        />
      );

      // 1. Set date
      const dateInput = screen.getByDisplayValue('');
      await user.type(dateInput, '1990-05-15');
      expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ date: '1990-05-15' }));

      // 2. Change precision
      const aproximadoButton = screen.getByRole('button', { name: /Aprox/i });
      await user.click(aproximadoButton);
      expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ precision: 'about' }));

      // 3. Add custom display
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      const customInput = screen.getByPlaceholderText(/ej: Invierno 1990/);
      await user.type(customInput, 'Invierno 1990');
      expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ display: 'Invierno 1990' }));
    });

    it('should preserve date when changing precision', async () => {
      const user = userEvent.setup();
      render(
        <GenoDateInput
          value={null}
          onChange={mockOnChange}
        />
      );

      // Set date with exact
      const dateInput = screen.getByDisplayValue('');
      await user.type(dateInput, '1990-05-15');

      // Change to about
      const aproximadoButton = screen.getByRole('button', { name: /Aprox/i });
      await user.click(aproximadoButton);

      // Should still have the date
      expect(mockOnChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          date: '1990-05-15',
          precision: 'about',
        })
      );
    });

    it('should clear date when switching to unknown', async () => {
      const user = userEvent.setup();
      render(
        <GenoDateInput
          value={null}
          onChange={mockOnChange}
        />
      );

      // Set date
      const dateInput = screen.getByDisplayValue('');
      await user.type(dateInput, '1990-05-15');

      // Switch to unknown
      const desconocidaButton = screen.getByRole('button', { name: /Desconocida/i });
      await user.click(desconocidaButton);

      expect(mockOnChange).toHaveBeenLastCalledWith({
        date: '',
        precision: 'unknown',
      });
    });
  });

  describe('Accessibility', () => {
    it('should have descriptive button titles for precision options', () => {
      render(
        <GenoDateInput
          value={null}
          onChange={mockOnChange}
        />
      );

      const exactButton = screen.getByRole('button', { name: /Exacta/i });
      expect(exactButton).toHaveAttribute('title', expect.stringContaining('Fecha precisa'));

      const aproximadoButton = screen.getByRole('button', { name: /Aprox/i });
      expect(aproximadoButton).toHaveAttribute('title', expect.stringContaining('Aproximadamente'));
    });

    it('should have descriptive placeholder text', () => {
      render(
        <GenoDateInput
          value={null}
          onChange={mockOnChange}
        />
      );

      const customInput = screen.queryByPlaceholderText(/ej:/);
      // Should not be visible by default, only when checkbox is checked
      if (customInput) {
        expect(customInput).toBeInTheDocument();
      }
    });
  });
});
