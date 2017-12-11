import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { ConnectionBackend, RequestOptions, BaseRequestOptions, Http, Response, ResponseOptions } from '@angular/http';
import { JhiDateUtils } from 'ng-jhipster';

import { UserService, User } from './../../../../../../main/webapp/app/shared';
import { SERVER_API_URL } from './../../../../../../main/webapp/app/app.constants';

describe('Service Tests', () => {

    describe('User Service', () => {
        let service: UserService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: ConnectionBackend,
                        useClass: MockBackend
                    },
                    {
                        provide: RequestOptions,
                        useClass: BaseRequestOptions
                    },
                    Http,
                    JhiDateUtils,
                    UserService
                ]
            });

            service = TestBed.get(UserService);

            this.backend = TestBed.get(ConnectionBackend) as MockBackend;
            this.backend.connections.subscribe((connection: any) => {
                this.lastConnection = connection;
            });
        }));

        describe('Service methods', () => {
            it('should call correct URL', () => {
                service.find('user').subscribe(() => {});
                const resourceUrl = SERVER_API_URL + 'api/users';

                expect(this.lastConnection).toBeDefined();
                expect(this.lastConnection.request.url).toEqual(`${resourceUrl}/user`);
            });
            it('should return User', () => {

                let entity: User;
                service.find('user').subscribe((_entity: User) => {
                    entity = _entity;
                });

                this.lastConnection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(new User(1, 'user')),
                })));

                expect(entity).toBeDefined();
                expect(entity.login).toEqual('user');
            });

            it('should return Authorities', () => {

                let authorities;
                service.authorities().subscribe((_authorities) => {
                    authorities = _authorities;
                });

                this.lastConnection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(['ROLE_USER', 'ROLE_ADMIN']),
                })));

                expect(authorities).toBeDefined();
                expect(authorities).toEqual(['ROLE_USER', 'ROLE_ADMIN']);
            });

            it('should propagate not found response', () => {

                let error: any;
                service.find('user').subscribe(null, (_error: any) => {
                    error = _error;
                });

                this.lastConnection.mockError(new Response(new ResponseOptions({
                    status: 404,
                })));

                expect(error).toBeDefined();
                expect(error.status).toEqual(404);
            });
        });
    });

});
