import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {environment} from '../environments/environment';
import factionDataJsonFile from '../data/factions.json';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortable} from '@angular/material/sort';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'kill-team-faction-chooser';
  currentApplicationVersion = environment.appVersion;

  displayedFactionColumns: string[] = ['thumbnail', 'name', 'alignment', 'movement', 'combat', 'shoot'];

  factionData: Faction[] = factionDataJsonFile;

  factionDataSource = new MatTableDataSource<Faction>(this.factionData);

  private paginator: MatPaginator;
  private sort: MatSort;

  // Form fields
  quickSearchField = '';
  searchFaction: Faction = new Faction();

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.sort.sort(({id: 'name', start: 'asc'}) as MatSortable);
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
      this.search();
    }
  }

  ngOnInit() {
    this.searchFaction.minMove = 4;
    this.searchFaction.maxMove = 9;

    this.setupSearchFilter();
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }

  search() {
    this.factionDataSource.filter = '[' + this.quickSearchField + ']';
  }

  setupSearchFilter() {

    this.factionDataSource.filterPredicate =
      (faction: Faction, filters: string) => {
        const matchFilter = [];

        // Quick search
        if (filters !== '[]') {
          const columns = [faction.id, faction.name, faction.alignmentGNE, faction.alignmentLNC, faction.colors.toString()];
          const filterArray = filters.split(/\W+/);

          filterArray.forEach(filter => {
            const customFilter = [];
            columns.forEach(column => customFilter.push(column.toLowerCase().includes(filter.toLowerCase())));
            matchFilter.push(customFilter.some(Boolean)); // OR
          });
        }

        if (this.searchFaction.minMove) {
          const movement = this.searchFaction.minMove;
          const customFilter = [];
          customFilter.push(faction.minMove >= movement);
          matchFilter.push(customFilter.some(Boolean)); // OR
        }

        if (this.searchFaction.maxMove) {
          const movement = this.searchFaction.maxMove;
          const customFilter = [];
          customFilter.push(faction.maxMove <= movement);
          matchFilter.push(customFilter.some(Boolean)); // OR
        }

        return matchFilter.every(Boolean); // AND
      };
  }
}

export class Faction {
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
