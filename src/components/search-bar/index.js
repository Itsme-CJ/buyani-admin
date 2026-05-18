import { FormControl, IconButton, InputAdornment, OutlinedInput } from '@material-ui/core';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';
import useStyles from './styles';

const SearchBar = (props) => {
  const classes = useStyles();

  const { handleSearchQuery, isFilter } = props;

  const handleSearch = (value) => {
    value.stopPropagation();
    handleSearchQuery(value.target.value)
  }

  return (
    <FormControl 
      className={`${classes.searchContainer} 
        ${classes.nSearchContainer} ${isFilter ? classes.mSearchContainer : ''}`} size='medium' variant="outlined"
    >
      <OutlinedInput
        id="search"
        type={'text'}
        fullWidth
        size='medium'
        autoFocus
        onChange={handleSearch}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              // onClick={handleSearch}
              edge="end"
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
        placeholder='Search'
      />
    </FormControl>
  );
}

export default SearchBar