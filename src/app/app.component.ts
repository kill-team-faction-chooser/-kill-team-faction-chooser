import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {environment} from '../environments/environment';
import factionDataJsonFile from '../data/factions.json';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortable} from '@angular/material/sort';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {conditionallyCreateMapObjectLiteral} from '@angular/compiler/src/render3/view/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'kill-team-faction-chooser';
  currentApplicationVersion = environment.appVersion;

  @Input() filterControl: FormControl;

  displayedFactionColumns: string[] =  ['thumbnail', 'name', 'alignment', 'movement', 'combat', 'shoot'];

  factionData: Faction[] = factionDataJsonFile;

  factionDataSource = new MatTableDataSource<Faction>(this.factionData);

  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.sort.sort(({ id: 'name', start: 'asc'}) as MatSortable);
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.factionDataSource.paginator = this.paginator;
    this.factionDataSource.sort = this.sort;

    if (this.paginator && this.sort) {
      this.quickSearch('');
    }
  }

  /*filteredOptions: Observable<string[]>;
  minimumMovementControl = new FormControl();*/

  ngOnInit() {
    /*this.factionDataSource.paginator = this.paginator;
    this.factionDataSource.sort = this.sort;*/

    /*this.filteredOptions = this.minimumMovementControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.minimumMovementFilter(value))
      );*/
  }

  /*private minimumMovementFilter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.factionDataSource.filter = (option => option.toLowerCase().includes(filterValue));
  }*/

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }

  quickSearch(filterValue: string) {
    this.setupQuickSearchFilter();

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.factionDataSource.filter = filterValue;
  }

  setupQuickSearchFilter() {
    this.factionDataSource.filterPredicate =
      (faction: Faction, filters: string) => {
        const matchFilter = [];
        const filterArray = filters.split(/\W+/);
        const columns = [faction.id, faction.name, faction.alignmentGNE, faction.alignmentLNC, faction.colors.toString()];

        // Main
        filterArray.forEach(filter => {
          const customFilter = [];
          columns.forEach(column => customFilter.push(column.toLowerCase().includes(filter.toLowerCase())));
          matchFilter.push(customFilter.some(Boolean)); // OR
        });

        return matchFilter.every(Boolean); // AND
      };
  }

  setupFilter(column: string) {
    this.factionDataSource.filterPredicate = (d: Faction, filter: string) => {
      const textToSearch = d[column] && d[column].toLowerCase() || '';
      return textToSearch.indexOf(filter) !== -1;
    };
  }
}

export interface Faction {
  id: string;
  name: string;
  thumbnailpath: string;
  alignmentLNC: string;
  alignmentGNE: string;
  minMove: number;
  maxMove: number;
  colors: string[];
  minCombat: number;
  maxCombat: number;
  minShoot: number;
  maxShoot: number;
}
