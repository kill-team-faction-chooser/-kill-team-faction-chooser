import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {environment} from '../environments/environment';
import factionDataJsonFile from '../data/factions.json';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'kill-team-faction-chooser';
  currentApplicationVersion = environment.appVersion;

  @Input() filterControl: FormControl;

  displayedFactionColumns: string[] =  ['thumbnail', 'name', 'alignment', 'movement'];

  factionData: Faction[] = factionDataJsonFile;

  factionDataSource = new MatTableDataSource<Faction>(this.factionData);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.factionDataSource.paginator = this.paginator;
    this.factionDataSource.sort = this.sort;
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }

  quickSearch(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.factionDataSource.filter = filterValue;
  }
}

export interface Faction {
  id: string;
  name: string;
  thumbnailpath: string;
  alignmentLNC: string;
  alignmentGNE: string;
  minMove: number;
  maxMove: number
}
