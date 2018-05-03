/* after changing this file run 'yarn run webpack:build' */
/* tslint:disable */
import '../content/css/vendor.css';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

// Imports all fontawesome core and solid icons

import fontawesome from '@fortawesome/fontawesome';
import solid from '@fortawesome/fontawesome-free-solid';

// Adds the SVG icon to the library so you can use it in your page
fontawesome.library.add(solid.faUser);
fontawesome.library.add(solid.faSort);
fontawesome.library.add(solid.faSync);
fontawesome.library.add(solid.faEye);
fontawesome.library.add(solid.faBan);
fontawesome.library.add(solid.faTimes);
fontawesome.library.add(solid.faArrowLeft);
fontawesome.library.add(solid.faSave);
fontawesome.library.add(solid.faPlus);
fontawesome.library.add(solid.faPencilAlt);
fontawesome.library.add(solid.faBars);
fontawesome.library.add(solid.faHome);
fontawesome.library.add(solid.faThList);
fontawesome.library.add(solid.faUserPlus);
fontawesome.library.add(solid.faRoad);
fontawesome.library.add(solid.faTachometerAlt);
fontawesome.library.add(solid.faHeart);
fontawesome.library.add(solid.faList);
fontawesome.library.add(solid.faBell);
fontawesome.library.add(solid.faTasks);
fontawesome.library.add(solid.faBook);
fontawesome.library.add(solid.faHdd);
fontawesome.library.add(solid.faFlag);
fontawesome.library.add(solid.faWrench);
fontawesome.library.add(solid.faClock);
fontawesome.library.add(solid.faCloud);
fontawesome.library.add(solid.faSignOutAlt);
fontawesome.library.add(solid.faSignInAlt);
fontawesome.library.add(solid.faCalendarAlt);
fontawesome.library.add(solid.faSearch);
fontawesome.library.add(solid.faTrashAlt);
fontawesome.library.add(solid.faAsterisk);

// jhipster-needle-add-element-to-vendor - JHipster will add new menu items here
