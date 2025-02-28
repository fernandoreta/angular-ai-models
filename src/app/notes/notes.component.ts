import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ISavedText } from 'src/interfaces/models.interface';
import { UtilsService } from 'src/services/utils.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class NotesComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'type'];
  dataSource: MatTableDataSource<ISavedText>;
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any | null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private utilsService: UtilsService) {
    const savedText = JSON.parse(localStorage.getItem('saved-texts') || '[]');
    this.dataSource = new MatTableDataSource(savedText);
  }

  deleteNote(note: ISavedText) {
    const savedText: ISavedText[] = JSON.parse(localStorage.getItem('saved-texts') || '[]');
    const updatedText = savedText.filter(item => item.name !== note.name);
    localStorage.setItem('saved-texts', JSON.stringify(updatedText));
    this.dataSource.data = updatedText;
    this.utilsService.openSnackBar('Note Deleted!');
  }  


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
