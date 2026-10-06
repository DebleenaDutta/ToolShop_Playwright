export enum NavigationSelectors {
  SignInLink = '[data-test="nav-sign-in"]',
  HomeLink = '[data-test="nav-home"]',
  Menu = '[data-test="nav-menu"]',
  SignOutLink = '[data-test="nav-sign-out"]',
}

export enum SignInPageSelectors {
  Email = '[data-test="email"]',
  Password = '[data-test="password"]',
  Submit = '[data-test="login-submit"]',
  ErrorLogin='[data-test="login-error"]',
}

export enum RegisterPageSelectors {
  RegisterLink = '[data-test="register-link"]',
  FirstName = '[data-test="first-name"]',
  LastName = '[data-test="last-name"]',
  DateOfBirth = '[data-test="dob"]',
  Country = '[data-test="country"]',
  PostalCode = '[data-test="postal_code"]',
  HouseNumber = '[data-test="house_number"]',
  State = '[data-test="state"]',
  Phone = '[data-test="phone"]',
  Email = '[data-test="email"]',
  Password = '[data-test="password"]',
  Submit = '[data-test="register-submit"]',
  FirstNameError = '[data-test="first-name-error"]',
  LastNameError = '[data-test="last-name-error"]',
  DateOfBirthError = '[data-test="dob-error"]',
  CountryError = '[data-test="country-error"]',
  PostalCodeError = '[data-test="postal_code-error"]',
  HouseNumberError = '[data-test="house_number-error"]',
  StreetError = '[data-test="street-error"]',
  CityError = '[data-test="city-error"]',
  StateError = '[data-test="state-error"]',
  PhoneError = '[data-test="phone-error"]',
  EmailError = '[data-test="email-error"]',
  PasswordError = '[data-test="password-error"]',
}

export enum AccountPageSelectors {
  Title = '[data-test="page-title"]',
}

export enum ProductCatalogPageSelectors {
  SearchQuery = '[data-test="search-query"]',
  SearchSubmit = '[data-test="search-submit"]',
}

export enum ProductDetailsPageSelectors {
  IncreaseQuantity = '[data-test="increase-quantity"]',
  AddToCart = '[data-test="add-to-cart"]',
  AddToCartAlert = '[role="alert"]',
}
