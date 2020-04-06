(() => ({
  name: 'FilterbarSelect',
  category: 'FORM',
  type: 'CONTENT_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const {
      label,
      required,
      disabled,
      defaultValue,
      variant,
      size,
      fullWidth,
      hasError,
      margin,
      helperText,
      selectOptions,
      model,
      filter,
      optionType,
      property,
      valueProperty: valueProp,
      actionInputId,
      inputname
    } = options;
    const { TextField, MenuItem } = window.MaterialUI.Core;
    const isDev = B.env === 'dev';
    const { GetAll, getProperty, getActionInput, useText, __SECRET_CONTEXT_DO_NOT_USE } = B;
    const [currentValue, setCurrentValue] = isDev
      ? useState(defaultValue.join(' '))
      : useState(useText(defaultValue));
    const helper = isDev ? helperText.join(' ') : useText(helperText);

    const actionInput = getActionInput(actionInputId);
    const value = currentValue;

    const [filterState, setFilterState] = isDev ? useState({}) : useContext(__SECRET_CONTEXT_DO_NOT_USE);

    const labelProperty = getProperty(property);
    const valueProperty = getProperty(valueProp);
    const { name: propName } = valueProperty || {};
    const { name: labelName } = labelProperty || {};

    const handleChange = event => {
      const {
        target: { value: eventValue },
      } = event;

      if(inputname) {
        const newFilterState = {
          ...filterState.filterState,
          [inputname]: eventValue
        }

        setFilterState(prev => {
          return ({...prev, filterState: newFilterState});
        });
      }

      setCurrentValue(eventValue);
    };

    const SelectCmp =
      optionType === 'static' ? (
        <TextField
          select
          value={
            isDev
              ? defaultValue
                  .map(textitem => (textitem.name ? textitem.name : textitem))
                  .join(' ')
              : value
          }
          size={size}
          variant={variant}
          fullWidth={fullWidth}
          onChange={handleChange}
          inputProps={{ name: actionInput && actionInput.name }}
          required={required}
          disabled={disabled}
          label={label}
          error={hasError}
          margin={margin}
          helperText={helper}
        >
          {(() => {
            if(options.includeblank) {
              return <MenuItem>{options.blancoLabel}</MenuItem>
            }
          })()}
          {(selectOptions || '').split('\n').map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <GetAll modelId={model} filter={filter} skip={0} take={50}>
          {({ loading, error, data }) => {
            if (loading) {
              return <span>Loading...</span>;
            }

            if (error) {
              return <span>Something went wrong: {error.message} :(</span>;
            }

            const { results } = data;
            return (
              <TextField
                select
                defaultValue={value}
                value={value}
                size={size}
                variant={variant}
                fullWidth={fullWidth}
                onChange={handleChange}
                inputProps={{ name: actionInput && actionInput.name }}
                required={required}
                disabled={disabled}
                label={label}
                error={hasError}
                margin={margin}
                helperText={helper}
              >
                {(() => {
                  if(options.includeblank) {
                    return <MenuItem>{options.blancoLabel}</MenuItem>
                  }
                })()}
                {results.map(
                  item =>
                    propName &&
                    labelName && (
                      <MenuItem key={item.id} value={item[propName]}>
                        {item[labelName]}
                      </MenuItem>
                    ),
                )}
              </TextField>
            );
          }}
        </GetAll>
      );

    return isDev ? <div className={classes.root}>{SelectCmp}</div> : SelectCmp;
  })(),
  styles: () => () => ({
    root: {
      display: ({ options: { fullWidth } }) =>
        fullWidth ? 'block' : 'inline-block',
      '& > *': {
        pointerEvents: 'none',
      },
    },
  }),
}))();